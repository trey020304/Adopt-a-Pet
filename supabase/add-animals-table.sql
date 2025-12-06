-- Migration: create animals table and seed sample data
create table if not exists public.animals (
  id uuid primary key default gen_random_uuid(),
  name text,
  type text,
  age text,
  sex text,
  breed text,
  size text,
  health text,
  behavior text,
  main_image text,
  gallery text[],
  rescuer_name text,
  rescuer_contact text,
  created_at timestamp with time zone default now()
);

-- Seed sample rows (uses repo sample images; you can update to storage paths later)
insert into public.animals (name, type, age, sex, breed, size, health, behavior, main_image, gallery, rescuer_name, rescuer_contact)
values
('Whiskers','Cat','2 years','Female','Tabby Mix','4 lbs','Healthy, up-to-date on vaccinations','Friendly, playful, good with children','/img/sample_adopt/cat 1.jpg', array['/img/sample_adopt/cat 1.jpg','/img/sample_adopt/cat 1.jpg'],'Jane Smith','jane@petrescue.com'),
('Shadow','Cat','1 year','Male','Black Domestic Shorthair','5 lbs','Healthy, neutered','Shy but warming up, needs patient home','/img/sample_adopt/cat 2.jpg', array['/img/sample_adopt/cat 2.jpg','/img/sample_adopt/cat 2.jpg'],'John Doe','john@petrescue.com'),
('Mittens','Cat','3 years','Female','British Shorthair','6 lbs','Healthy, spayed','Affectionate, loves attention','/img/sample_adopt/cat 3.jpg', array['/img/sample_adopt/cat 3.jpg','/img/sample_adopt/cat 3.jpg'],'Sarah Johnson','sarah@petrescue.com'),
('Max','Dog','3 years','Male','Miniature Poodle Mix','55 lbs','Healthy, neutered, vaccinated','Friendly, energetic, good with families','/img/sample_adopt/dog 1.jpg', array['/img/sample_adopt/dog 1.jpg','/img/sample_adopt/dog 1.jpg'],'Mike Wilson','mike@petrescue.com'),
('Bella','Dog','2 years','Female','Staffordshire Bull Terrier','50 lbs','Healthy, minor hip dysplasia (manageable)','Gentle, loves walks, good with other dogs','/img/sample_adopt/dog 2.jpg', array['/img/sample_adopt/dog 2.jpg','/img/sample_adopt/dog 2.jpg'],'Emily Brown','emily@petrescue.com'),
('Rocky','Dog','4 years','Male','Golden Retriever','65 lbs','Healthy, fully vaccinated','Protective, loyal, needs experienced handler','/img/sample_adopt/dog 3.jpg', array['/img/sample_adopt/dog 3.jpg','/img/sample_adopt/dog 3.jpg'],'Tom Martinez','tom@petrescue.com');
