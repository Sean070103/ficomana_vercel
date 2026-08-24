-- Add Capping and Pinning Photoshoot (graduation additional service).
INSERT INTO packages (
  id,
  category,
  title,
  price_display,
  price_amount,
  duration,
  description,
  features,
  slot_type,
  sort_order,
  is_active
)
VALUES (
  'capping-pinning',
  'capping-pinning',
  'CAPPING AND PINNING PHOTOSHOOT',
  '₱4,000',
  4000,
  'Studio session',
  'Additional service · ₱500 deposit required',
  '["Free Makeup","2 edited/enhanced photos","1 layout/outfit","All raw copies","1 pc. 8R Glass-to-Glass Frame","2 pcs. 4R-sized printed copies","7–14 working days for editing process"]'::jsonb,
  'makeup',
  3,
  true
)
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  price_display = EXCLUDED.price_display,
  price_amount = EXCLUDED.price_amount,
  duration = EXCLUDED.duration,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  slot_type = EXCLUDED.slot_type,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

-- FICO package availability copy
UPDATE packages
SET description = 'Available anytime from 8:00 AM – 4:00 PM'
WHERE id = 'fico-package';
