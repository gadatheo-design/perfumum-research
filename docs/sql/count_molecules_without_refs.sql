SELECT COUNT(*) as molecules_sans_references
FROM molecules
WHERE references IS NULL OR references = '[]';
