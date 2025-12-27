import Plan from "../models/Plan.js";
import sanitizeInput from "../utils/sanitizeInput.js";

const createPlan = async (req, res) => {
  const data = req.body;

  try {
    const plan = await Plan.create({
      name: sanitizeInput(data.name),
      price: Number(data.price),
      featuresJSON: typeof data.featuresJSON === "object" ? data.featuresJSON : {},
    });

    return res.json({
      status: 201,
      message: "Plan created successfully",
      plan,
    });
  } catch (e) {
    console.error("Error creating plan:", e);
    return res.status(500).json({ message: "Failed to create plan" });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });
    return res.json(plans);
  } catch (e) {
    console.error("Error fetching plans:", e);
    return res.status(500).json({ message: "Failed to fetch plans" });
  }
};

const getPlan = async (req, res) => {
  const id = req.params.id;

  try {
    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    return res.json(plan);
  } catch (e) {
    console.error("Error retrieving plan:", e);
    return res.status(500).json({ message: "Failed to fetch plan" });
  }
};

const updatePlan = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const updated = await Plan.findByIdAndUpdate(
      id,
      {
        name: sanitizeInput(data.name),
        price: Number(data.price),
        featuresJSON:
          typeof data.featuresJSON === "object"
            ? data.featuresJSON
            : undefined,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Plan not found" });

    return res.json({
      status: 200,
      message: "Plan updated successfully",
      plan: updated,
    });
  } catch (e) {
    console.error("Error updating plan:", e);
    return res.status(500).json({ message: "Failed to update plan" });
  }
};

const deletePlan = async (req, res) => {
  const id = req.params.id;

  try {
    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await Plan.findByIdAndDelete(id);

    return res.json({
      status: 200,
      message: "Plan deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting plan:", e);
    return res.status(500).json({ message: "Failed to delete plan" });
  }
};

export default {
  createPlan,
  getPlans,
  getPlan,
  updatePlan,
  deletePlan,
};
