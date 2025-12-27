// Stripe service for payment processing
// Note: Requires stripe package: npm install stripe

/**
 * Initialize Stripe with API key
 */
let stripe = null;

const initializeStripe = async () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    try {
      // Use dynamic import for ES modules
      const stripeModule = await import('stripe');
      stripe = stripeModule.default(process.env.STRIPE_SECRET_KEY);
      console.log('Stripe initialized successfully');
    } catch (error) {
      console.error('Error loading Stripe module:', error);
      console.log('Note: Install stripe package with: npm install stripe');
    }
  }
  return stripe;
};

/**
 * Create a Stripe checkout session for plan subscription
 * @param {string} planId - Plan ID from database
 * @param {Object} plan - Plan object with name and price
 * @param {string} userId - User ID
 * @param {string} userEmail - User email
 * @param {string} successUrl - URL to redirect after successful payment
 * @param {string} cancelUrl - URL to redirect after cancelled payment
 */
export const createCheckoutSession = async (planId, plan, userId, userEmail, successUrl, cancelUrl) => {
  try {
    console.log('Initializing Stripe...');
    const stripeInstance = await initializeStripe();
    
    if (!stripeInstance) {
      console.error('Stripe instance is null - STRIPE_SECRET_KEY may not be set');
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.');
    }
    
    console.log('Stripe initialized successfully');

    // Create or retrieve Stripe customer
    let customer;
    try {
      // Try to find existing customer by email
      const customers = await stripeInstance.customers.list({
        email: userEmail,
        limit: 1,
      });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        // Create new customer
        customer = await stripeInstance.customers.create({
          email: userEmail,
          metadata: {
            userId: userId.toString(),
          },
        });
      }
    } catch (error) {
      console.error('Error creating/finding Stripe customer:', error);
      throw error;
    }

    // Create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: `Subscription plan: ${plan.name}`,
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        planId: planId.toString(),
        userId: userId.toString(),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          planId: planId.toString(),
          userId: userId.toString(),
        },
      },
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
      customerId: customer.id,
    };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode
    });
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
};

/**
 * Retrieve Stripe checkout session
 */
export const getCheckoutSession = async (sessionId) => {
  try {
    const stripeInstance = await initializeStripe();
    
    if (!stripeInstance) {
      throw new Error('Stripe is not configured');
    }

    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    return {
      success: true,
      session,
    };
  } catch (error) {
    console.error('Error retrieving Stripe checkout session:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Handle Stripe webhook event
 */
export const handleWebhookEvent = async (event) => {
  try {
    const stripeInstance = await initializeStripe();
    
    if (!stripeInstance) {
      throw new Error('Stripe is not configured');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        // Payment successful, subscription created
        const session = event.data.object;
        return {
          success: true,
          type: 'checkout.session.completed',
          sessionId: session.id,
          subscriptionId: session.subscription,
          customerId: session.customer,
          metadata: session.metadata,
        };
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        return {
          success: true,
          type: event.type,
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          metadata: subscription.metadata,
        };
      
      default:
        return {
          success: true,
          type: event.type,
          message: 'Event handled but no action taken',
        };
    }
  } catch (error) {
    console.error('Error handling Stripe webhook event:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  initializeStripe,
  createCheckoutSession,
  getCheckoutSession,
  handleWebhookEvent,
};
