\c commerce;  

INSERT INTO products (product_name, release_date, image, description, price, category, manufacturer, favorites) VALUES
('One Piece Vol 1', 'December 24, 1997', 'http://prodimage.images-bn.com/pimages/9781569319017_p0_v1_s1200x630.jpg','The first volume of the highly acclaimed manga by Echiiro Oda', 9.99,'Anime/Manga','Shueisha', FALSE),
 ('Gamecube Controller',
  'October 17, 2018',
   'https://m.media-amazon.com/images/I/71Pxz0BUbbL.jpg',
   'This controller can be use to play Gamecube games, some Wii games, and most importantly the controller for competitive Smash players',
   69.99,
    'Video Games',
   'Nintendo',
   FALSE),
('Metroid Dread',
'October 8, 2021',
'https://m.media-amazon.com/images/I/816ZIy1Y0-L.jpg',
'The highly anticapted 5th mainline game of the Metroid series, sees the return of Samus Aran as she continue her mission to eradicate the X parasies',
59.99,
'Video Games',
'Nintendo',
FALSE),
('Smash Ultimate',
'December 7, 2018',
'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5723/5723319_sd.jpg',
'Platform fighting game featuring various games from famous Nintendo franchises and as well as guest characters from third party companies. The game brings back every single character from previous smash games and as well as new ones',
59.99,
'Video Games',
'Nintendo',
FALSE);


INSERT INTO reviews (product_id, reviewer, title, content, rating )
VALUES
('1', 'Chris', 'Best Manga', 'The beginning of the one the greatest stories ever written', 5),
('2', 'Sam', 'Pretty solid', 'The controller is great for Smash', 4),
('4', 'Tony Hoang', 'Its alright', 'As a casual game its pretty good, but as a competitor there is a lot to be desire', 4),
('3', 'Ben', 'Excellent Metroid game', 'As a long time fan its was great to see Samus once again in a brand new 2D game', 5)
