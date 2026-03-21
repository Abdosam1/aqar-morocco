-- Seed Data for Aqar Morocco

-- 1. Property Types
INSERT INTO property_types (name_fr, name_ar, name_en, slug) VALUES
('Appartement', 'شقة', 'Apartment', 'appartement'),
('Villa', 'فيلا', 'Villa', 'villa'),
('Maison', 'منزل', 'House', 'maison'),
('Bureau', 'مكتب', 'Office', 'bureau'),
('Magasin / Local commercial', 'محل تجاري', 'Shop / Commercial', 'magasin-commercial'),
('Terrain', 'بقعة أرضية', 'Land', 'terrain'),
('Riad', 'رياض', 'Riad', 'riad'),
('Ferme', 'ضيعة', 'Farm', 'ferme');

-- 2. Cities
INSERT INTO cities (name_fr, name_ar, name_en, region) VALUES
('Casablanca', 'الدار البيضاء', 'Casablanca', 'Casablanca-Settat'),
('Rabat', 'الرباط', 'Rabat', 'Rabat-Salé-Kénitra'),
('Marrakech', 'مراكش', 'Marrakech', 'Marrakech-Safi'),
('Tanger', 'طنجة', 'Tangier', 'Tanger-Tétouan-Al Hoceïma'),
('Agadir', 'أكادير', 'Agadir', 'Souss-Massa'),
('Fès', 'فاس', 'Fez', 'Fès-Meknès'),
('Meknès', 'مكناس', 'Meknes', 'Fès-Meknès'),
('Oujda', 'وجدة', 'Oujda', 'Oriental'),
('Kénitra', 'القنيطرة', 'Kenitra', 'Rabat-Salé-Kénitra'),
('Tétouan', 'تطوان', 'Tetouan', 'Tanger-Tétouan-Al Hoceïma');

-- 3. Neighborhoods (Sample for Casablanca & Rabat)
-- Assuming IDs 1 and 2 for Casablanca and Rabat based on order above
INSERT INTO neighborhoods (city_id, name_fr, name_ar, name_en) VALUES
(1, 'Maarif', 'المعارف', 'Maarif'),
(1, 'Gauthier', 'غوتييه', 'Gauthier'),
(1, 'Bourgogne', 'بوركون', 'Borgogne'),
(1, 'Ain Diab', 'عين الذئاب', 'Ain Diab'),
(1, 'California', 'كاليفورنيا', 'California'),
(2, 'Agdal', 'أكدال', 'Agdal'),
(2, 'Hay Riad', 'حي الرياض', 'Hay Riad'),
(2, 'Hassan', 'حسان', 'Hassan'),
(2, 'Souissi', 'السويسي', 'Souissi');
