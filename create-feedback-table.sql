-- Create customer_feedbacks table
CREATE TABLE IF NOT EXISTS customer_feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    
    -- Customer information
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    
    -- Ratings (1-5 scale)
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    product_rating INTEGER CHECK (product_rating >= 1 AND product_rating <= 5),
    packaging_rating INTEGER CHECK (packaging_rating >= 1 AND packaging_rating <= 5),
    delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    
    -- Feedback content
    comment TEXT,
    images JSONB, -- Array of image URLs
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customer_feedbacks_experience_id ON customer_feedbacks(experience_id);
CREATE INDEX IF NOT EXISTS idx_customer_feedbacks_brand_id ON customer_feedbacks(brand_id);
CREATE INDEX IF NOT EXISTS idx_customer_feedbacks_created_at ON customer_feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_feedbacks_overall_rating ON customer_feedbacks(overall_rating);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_feedbacks_updated_at 
    BEFORE UPDATE ON customer_feedbacks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE customer_feedbacks ENABLE ROW LEVEL SECURITY;

-- Policy: Brands can only see their own feedbacks
CREATE POLICY "Brands can view their own feedbacks" ON customer_feedbacks
    FOR SELECT USING (
        brand_id IN (
            SELECT brand_id FROM user_brands WHERE user_id = auth.uid()
        )
    );

-- Policy: Anyone can insert feedback (public submissions)
CREATE POLICY "Anyone can submit feedback" ON customer_feedbacks
    FOR INSERT WITH CHECK (true);

-- Policy: Brands can update their own feedbacks (for moderation)
CREATE POLICY "Brands can update their own feedbacks" ON customer_feedbacks
    FOR UPDATE USING (
        brand_id IN (
            SELECT brand_id FROM user_brands WHERE user_id = auth.uid()
        )
    );

-- Policy: Brands can delete their own feedbacks (for moderation)
CREATE POLICY "Brands can delete their own feedbacks" ON customer_feedbacks
    FOR DELETE USING (
        brand_id IN (
            SELECT brand_id FROM user_brands WHERE user_id = auth.uid()
        )
    );
