-- Restore FICO 3 and FICO 4 to the public package catalog.
UPDATE packages
SET is_active = true
WHERE id IN ('fico-3', 'fico-4');
