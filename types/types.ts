

export type Campaign = {
    id: number;
    title: string;
    cover_image_url: string | null;  // Since it can be `nil` in Ruby, which translates to `null` in JavaScript
    user_id: number;
    created_at: Date;  // This assumes you're getting a date in a format JavaScript can parse; adjust if needed
    updated_at: Date;
    category_id: number;
    content: string;
    // ... Add any other fields if needed
  };
  