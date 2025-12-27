'use client';

import type { FormEvent } from 'react';
import { Lock, Save, User as UserIcon, CreditCard, CheckCircle2 } from 'lucide-react';

type PlanLike = {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  interval?: string; // monthly/yearly
  features?: string[];
  isPopular?: boolean;
};

type UserPlanLike = {
  planId?: any; // can be populated object or string id depending on API
  status?: string;
  currentPeriodEnd?: string;
};

type Props = {
  // Profile
  profileForm: {
    name: string;
    username: string;
    email: string;
    companyName: string;
  };
  setProfileForm: (v: Props['profileForm']) => void;
  updateProfile: (e: FormEvent) => void | Promise<void>;

  // Password
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordForm: (v: Props['passwordForm']) => void;
  showPasswordForm: boolean;
  setShowPasswordForm: (v: boolean) => void;
  changePassword: (e: FormEvent) => void | Promise<void>;

  // Plans
  plans: PlanLike[];
  userPlan: UserPlanLike | null;
  selectedPlanId: string | null;
  selectingPlan: boolean;
  selectUserPlan: (planId: string) => void | Promise<void>;
};

const getId = (x: any): string => {
  if (!x) return '';
  if (typeof x === 'string') return x;
  return String(x._id ?? x.id ?? '');
};

const fmtMoney = (amount?: number, currency?: string) => {
  const c = (currency ?? 'USD').toUpperCase();
  const n = Number(amount ?? 0);
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: c }).format(n);
  } catch {
    return `${c} ${n.toFixed(2)}`;
  }
};

export function SettingsTab({
  profileForm,
  setProfileForm,
  updateProfile,

  passwordForm,
  setPasswordForm,
  showPasswordForm,
  setShowPasswordForm,
  changePassword,

  plans,
  userPlan,
  selectedPlanId,
  selectingPlan,
  selectUserPlan,
}: Props) {
  const activePlanId = selectedPlanId || getId(userPlan?.planId);

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
            <UserIcon className="h-6 w-6 text-purple-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Profile</h3>
            <p className="text-sm text-gray-400">Update your account details.</p>
          </div>
        </div>

        <form onSubmit={updateProfile} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-gray-400">Name</label>
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Username</label>
            <input
              value={profileForm.username}
              onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Company</label>
            <input
              value={profileForm.companyName}
              onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Company name"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-500"
            >
              <Save className="h-4 w-4" />
              Save profile
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-600/20">
              <Lock className="h-6 w-6 text-pink-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Password</h3>
              <p className="text-sm text-gray-400">Change your password.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            {showPasswordForm ? 'Hide' : 'Change password'}
          </button>
        </div>

        {showPasswordForm ? (
          <form onSubmit={changePassword} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-400">Current password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Current password"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">New password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="New password"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Confirm new password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setShowPasswordForm(false);
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-500"
              >
                <Save className="h-4 w-4" />
                Update password
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-500">Password change form is hidden.</p>
        )}
      </div>

      {/* Plan */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20">
            <CreditCard className="h-6 w-6 text-blue-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Plan</h3>
            <p className="text-sm text-gray-400">Manage your subscription plan.</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-gray-400">Current plan</p>
          <p className="mt-1 text-lg font-bold text-white">
            {activePlanId ? 'Active plan selected' : 'No active plan'}
          </p>
          {userPlan?.status ? <p className="mt-1 text-xs text-gray-500">Status: {String(userPlan.status)}</p> : null}
        </div>

        {plans?.length ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {plans.map((p) => {
              const pid = getId(p);
              const isCurrent = !!pid && pid === activePlanId;

              return (
                <div
                  key={pid || p.name || Math.random()}
                  className={[
                    'rounded-2xl border p-5 transition-all',
                    isCurrent ? 'border-purple-600/40 bg-purple-600/10' : 'border-white/10 bg-white/5 hover:bg-white/10',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-white">{p.name ?? 'Plan'}</p>
                      {p.description ? <p className="mt-1 text-sm text-gray-400">{p.description}</p> : null}
                    </div>

                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-1 text-xs font-semibold text-green-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Current
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <p className="text-2xl font-bold text-white">
                      {fmtMoney(p.price, p.currency)}
                      <span className="ml-1 text-sm font-medium text-gray-400">
                        /{(p.interval ?? 'month').toString().replace('ly', '')}
                      </span>
                    </p>
                  </div>

                  {Array.isArray(p.features) && p.features.length > 0 ? (
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                      {p.features.slice(0, 6).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">No feature list provided.</p>
                  )}

                  <div className="mt-5">
                    <button
                      type="button"
                      disabled={selectingPlan || !pid || isCurrent}
                      onClick={() => pid && selectUserPlan(pid)}
                      className={[
                        'w-full rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                        isCurrent
                          ? 'cursor-not-allowed bg-white/10 text-gray-400'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 disabled:opacity-60',
                      ].join(' ')}
                    >
                      {selectingPlan ? 'Processing...' : isCurrent ? 'Selected' : 'Choose plan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No plans found.</p>
        )}
      </div>
    </div>
  );
}
