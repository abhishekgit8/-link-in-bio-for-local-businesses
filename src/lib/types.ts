export type SubscriptionTier = 'free' | 'pro';
export type Theme = 'classic' | 'dark' | 'warm' | 'minimal';
export type ButtonStyle = 'filled' | 'outline' | 'soft' | 'shadow';
export type Font = 'inter' | 'serif' | 'poppins';
export type Category = 'salon' | 'cafe' | 'tutor' | 'freelancer' | 'coach' | 'other';
export type LinkType = 'url' | 'phone' | 'whatsapp' | 'instagram' | 'maps' | 'email' | 'custom';
export type CoverType = 'color' | 'image';
export type SubscriptionStatus = 'inactive' | 'active' | 'cancelling';

export interface Profile {
  id: string;
  username: string;
  business_name: string;
  category: Category | null;
  tagline: string | null;
  bio: string | null;
  logo_url: string | null;
  cover_type: CoverType | null;
  cover_value: string | null;
  theme: Theme;
  button_style: ButtonStyle;
  font: Font;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus | null;
  subscription_end_date: string | null;
  razorpay_customer_id: string | null;
  razorpay_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  profile_id: string;
  type: LinkType;
  label: string;
  url: string;
  icon: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
}

export interface UsernameRedirect {
  id: string;
  old_username: string;
  new_username: string;
  created_at: string;
}
