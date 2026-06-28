/* Ataraxia — background image pool (data only)
 * Exports: BACKGROUNDS (global array)
 */
const BACKGROUNDS = [
  // ── Natural landscapes — Unsplash ──────────────────────────────
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85", credit: "Samuel Ferrara", link: "https://unsplash.com/@samferrara", source: "Unsplash", title: "Alpine Summit" },
  { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=85", credit: "Lukasz Szmigiel", link: "https://unsplash.com/@szmigieldesign", source: "Unsplash", title: "Forest Mist" },
  { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=85", credit: "Luca Bravo", link: "https://unsplash.com/@lucabravo", source: "Unsplash", title: "Forest Light" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85", credit: "Sean Oulashin", link: "https://unsplash.com/@oulashin", source: "Unsplash", title: "Tropical Beach" },
  { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=85", credit: "Benjamin Voros", link: "https://unsplash.com/@vorosbenisop", source: "Unsplash", title: "Starry Mountains" },
  { url: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=1920&q=85", credit: "Frank McKenna", link: "https://unsplash.com/@frankiefoto", source: "Unsplash", title: "Northern Lights" },
  { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=85", credit: "David Marcu", link: "https://unsplash.com/@davidmarcu", source: "Unsplash", title: "Sun Through Trees" },
  { url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=85", credit: "Robert Lukeman", link: "https://unsplash.com/@robertlukeman", source: "Unsplash", title: "Lake Reflection" },
  { url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=85", credit: "Kazuend", link: "https://unsplash.com/@kazuend", source: "Unsplash", title: "Waterfall Forest" },
  { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=85", credit: "Pietro De Grandi", link: "https://unsplash.com/@pietrozj", source: "Unsplash", title: "Mountain Sunrise" },
  // ── Meditative & ancient themes — Unsplash ─────────────────────
  { url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&q=85", credit: "Luca Bravo", link: "https://unsplash.com/@lucabravo", source: "Unsplash", title: "Night Sky" },
  { url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&q=85", credit: "Ian Dooley", link: "https://unsplash.com/@sadswim", source: "Unsplash", title: "Desert Sands" },
  { url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=85", credit: "Luca Upper", link: "https://unsplash.com/@lucaupper", source: "Unsplash", title: "Golden Road" },
  { url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&q=85", credit: "Joanna Kosinska", link: "https://unsplash.com/@joannakosinska", source: "Unsplash", title: "Lavender Fields" },
  { url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1920&q=85", credit: "Ricardo Gomez Angel", link: "https://unsplash.com/@rgaleriacom", source: "Unsplash", title: "Spiral Galaxy" },
  { url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=85", credit: "Luca Zanon", link: "https://unsplash.com/@luca_zanon", source: "Unsplash", title: "Snowy Trees" },
  { url: "https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1920&q=85", credit: "Alessio Lin", link: "https://unsplash.com/@lin_alessio", source: "Unsplash", title: "Stone Arch" },
  { url: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1920&q=85", credit: "v2osk", link: "https://unsplash.com/@v2osk", source: "Unsplash", title: "Volcanic Landscape" },
  // ── Mountains, deserts, stars — Unsplash ───────────────────────
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85", credit: "Kalen Emsley", link: "https://unsplash.com/@kalenemsley", source: "Unsplash", title: "Mountain Peak" },
  { url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=85", credit: "Joshua Earle", link: "https://unsplash.com/@joshuaearle", source: "Unsplash", title: "Misty Summit" },
  { url: "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=1920&q=85", credit: "Vincentiu Solomon", link: "https://unsplash.com/@vincentiu", source: "Unsplash", title: "Milky Way" },
  { url: "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=1920&q=85", credit: "Luca Baggio", link: "https://unsplash.com/@luca42", source: "Unsplash", title: "Pine Forest" },
  { url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&q=85", credit: "Austin Neill", link: "https://unsplash.com/@arstyy", source: "Unsplash", title: "Autumn Forest" },
  { url: "https://images.unsplash.com/photo-1504700610630-ac6edd918f09?w=1920&q=85", credit: "Jeremy Bishop", link: "https://unsplash.com/@jeremybishop", source: "Unsplash", title: "Ocean Cliff" },
  { url: "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=1920&q=85", credit: "Josh Gordon", link: "https://unsplash.com/@joshgordon", source: "Unsplash", title: "Desert Stars" },
  { url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=85", credit: "Jonatan Pie", link: "https://unsplash.com/@r3dmax", source: "Unsplash", title: "Aurora Borealis" },
  // ── Oceans, coasts, dawn — Unsplash ────────────────────────────
  { url: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1920&q=85", credit: "Cristina Gottardi", link: "https://unsplash.com/@cristina_gottardi", source: "Unsplash", title: "Sea of Clouds" },
  { url: "https://images.unsplash.com/photo-1520942702018-0862200e6873?w=1920&q=85", credit: "Silas Baisch", link: "https://unsplash.com/@silasbaisch", source: "Unsplash", title: "Ocean Shore" },
  { url: "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=1920&q=85", credit: "Jordan McQueen", link: "https://unsplash.com/@jordanmcqueen", source: "Unsplash", title: "Sunrise Coast" },
  { url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=85", credit: "Levi Bare", link: "https://unsplash.com/@levibare", source: "Unsplash", title: "Golden Cliffs" },
  // ── Pexels — free open license ─────────────────────────────────
  { url: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&w=1920", credit: "Eberhard Grossgasteiger", link: "https://www.pexels.com/photo/1287145/", source: "Pexels", title: "Alpine Meadow" },
  { url: "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&w=1920", credit: "Pixabay", link: "https://www.pexels.com/photo/36717/", source: "Pexels", title: "Misty Mountains" },
  { url: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&w=1920", credit: "Rafael Cerqueira", link: "https://www.pexels.com/photo/1671325/", source: "Pexels", title: "Mountain Path" },
  { url: "https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&w=1920", credit: "Felipe Palacio", link: "https://www.pexels.com/photo/2387418/", source: "Pexels", title: "Foggy Valley" },
  { url: "https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&w=1920", credit: "Trace Hudson", link: "https://www.pexels.com/photo/1496373/", source: "Pexels", title: "Ocean Waves" },
  { url: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&w=1920", credit: "Felix Mittermeier", link: "https://www.pexels.com/photo/2166553/", source: "Pexels", title: "Winter Forest" },
  // ── Wikimedia Commons — Public Domain Art ──────────────────────
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Wanderer_above_the_sea_of_fog.jpg",
    credit: "Wanderer above the Sea of Fog — Caspar David Friedrich, 1818",
    link: "https://commons.wikimedia.org/wiki/File:Wanderer_above_the_sea_of_fog.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1920px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
    credit: "The School of Athens — Raphael, 1511",
    link: "https://commons.wikimedia.org/wiki/File:%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "greco-roman"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/David_-_The_Death_of_Socrates.jpg/1920px-David_-_The_Death_of_Socrates.jpg",
    credit: "The Death of Socrates — Jacques-Louis David, 1787",
    link: "https://commons.wikimedia.org/wiki/File:David_-_The_Death_of_Socrates.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "greco-roman"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Thomas_Cole_-_The_Oxbow_%28The_Connecticut_River_near_Northampton%29.jpg/1920px-Thomas_Cole_-_The_Oxbow_%28The_Connecticut_River_near_Northampton%29.jpg",
    credit: "The Oxbow — Thomas Cole, 1836",
    link: "https://commons.wikimedia.org/wiki/File:Thomas_Cole_-_The_Oxbow_(The_Connecticut_River_near_Northampton).jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1920px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    credit: "The Starry Night — Vincent van Gogh, 1889",
    link: "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/VanGogh-starry_night_ballance1.jpg/1920px-VanGogh-starry_night_ballance1.jpg",
    credit: "Starry Night Over the Rhône — Vincent van Gogh, 1888",
    link: "https://commons.wikimedia.org/wiki/File:VanGogh-starry_night_ballance1.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Caspar_David_Friedrich_-_Der_Mönch_am_Meer_-_Google_Art_Project.jpg/1920px-Caspar_David_Friedrich_-_Der_Mönch_am_Meer_-_Google_Art_Project.jpg",
    credit: "The Monk by the Sea — Caspar David Friedrich, 1810",
    link: "https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Der_M%C3%B6nch_am_Meer_-_Google_Art_Project.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1920px-Tsunami_by_hokusai_19th_century.jpg",
    credit: "The Great Wave off Kanagawa — Hokusai, 1831",
    link: "https://commons.wikimedia.org/wiki/File:Tsunami_by_hokusai_19th_century.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "japanese"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Monet_-_Impression%2C_Sunrise.jpg/1920px-Monet_-_Impression%2C_Sunrise.jpg",
    credit: "Impression, Sunrise — Claude Monet, 1872",
    link: "https://commons.wikimedia.org/wiki/File:Monet_-_Impression,_Sunrise.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Chicago.jpg/1920px-Claude_Monet_-_Water_Lilies_-_1906%2C_Chicago.jpg",
    credit: "Water Lilies — Claude Monet, 1906",
    link: "https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_1906,_Chicago.jpg",
    source: "Wikimedia Commons · Public Domain"
  },

  /* ── More Wikimedia Commons Public Domain Art ── */
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg/1920px-The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg",
    credit: "The Fighting Temeraire — J.M.W. Turner, 1839",
    link: "https://commons.wikimedia.org/wiki/File:The_Fighting_Temeraire,_JMW_Turner,_National_Gallery.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1024px-1665_Girl_with_a_Pearl_Earring.jpg",
    credit: "Girl with a Pearl Earring — Johannes Vermeer, c. 1665",
    link: "https://commons.wikimedia.org/wiki/File:1665_Girl_with_a_Pearl_Earring.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1920px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
    credit: "The Birth of Venus — Sandro Botticelli, c. 1485",
    link: "https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "greco-roman"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/The_Hay_Wain_1821.jpg/1920px-The_Hay_Wain_1821.jpg",
    credit: "The Hay Wain — John Constable, 1821",
    link: "https://commons.wikimedia.org/wiki/File:The_Hay_Wain_1821.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Cole_Thomas_The_Oxbow_%28The_Connecticut_River_near_Northampton_1836%29.jpg/1920px-Cole_Thomas_The_Oxbow_%28The_Connecticut_River_near_Northampton_1836%29.jpg",
    credit: "The Oxbow — Thomas Cole, 1836",
    link: "https://commons.wikimedia.org/wiki/File:Cole_Thomas_The_Oxbow_(The_Connecticut_River_near_Northampton_1836).jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Albert_Bierstadt_-_Among_the_Sierra_Nevada%2C_California_-_Google_Art_Project.jpg/1920px-Albert_Bierstadt_-_Among_the_Sierra_Nevada%2C_California_-_Google_Art_Project.jpg",
    credit: "Among the Sierra Nevada, California — Albert Bierstadt, 1868",
    link: "https://commons.wikimedia.org/wiki/File:Albert_Bierstadt_-_Among_the_Sierra_Nevada,_California_-_Google_Art_Project.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Aivazovsky%2C_Ivan_-_The_Ninth_Wave.jpg/1920px-Aivazovsky%2C_Ivan_-_The_Ninth_Wave.jpg",
    credit: "The Ninth Wave — Ivan Aivazovsky, 1850",
    link: "https://commons.wikimedia.org/wiki/File:Aivazovsky,_Ivan_-_The_Ninth_Wave.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Whistler-Nocturne_in_black_and_gold.jpg/1024px-Whistler-Nocturne_in_black_and_gold.jpg",
    credit: "Nocturne in Black and Gold: The Falling Rocket — James McNeill Whistler, 1875",
    link: "https://commons.wikimedia.org/wiki/File:Whistler-Nocturne_in_black_and_gold.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Frederic_Edwin_Church_-_Heart_of_the_Andes_-_Google_Art_Project.jpg/1920px-Frederic_Edwin_Church_-_Heart_of_the_Andes_-_Google_Art_Project.jpg",
    credit: "Heart of the Andes — Frederic Edwin Church, 1859",
    link: "https://commons.wikimedia.org/wiki/File:Frederic_Edwin_Church_-_Heart_of_the_Andes_-_Google_Art_Project.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Turner_-_Rain%2C_Steam_and_Speed_-_National_Gallery_file.jpg/1920px-Turner_-_Rain%2C_Steam_and_Speed_-_National_Gallery_file.jpg",
    credit: "Rain, Steam and Speed — J.M.W. Turner, 1844",
    link: "https://commons.wikimedia.org/wiki/File:Turner_-_Rain,_Steam_and_Speed_-_National_Gallery_file.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Caspar_David_Friedrich_-_Das_Eismeer_-_Hamburger_Kunsthalle_-_02.jpg/1920px-Caspar_David_Friedrich_-_Das_Eismeer_-_Hamburger_Kunsthalle_-_02.jpg",
    credit: "The Sea of Ice (Das Eismeer) — Caspar David Friedrich, 1824",
    link: "https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Das_Eismeer_-_Hamburger_Kunsthalle_-_02.jpg",
    source: "Wikimedia Commons · Public Domain"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/John_Martin_-_The_Great_Day_of_His_Wrath_-_Google_Art_Project.jpg/1920px-John_Martin_-_The_Great_Day_of_His_Wrath_-_Google_Art_Project.jpg",
    credit: "The Great Day of His Wrath — John Martin, 1851–1853",
    link: "https://commons.wikimedia.org/wiki/File:John_Martin_-_The_Great_Day_of_His_Wrath_-_Google_Art_Project.jpg",
    source: "Wikimedia Commons · Public Domain"
  },

  /* ── More Unsplash Nature ── */
  {
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=85",
    credit: "Jonatan Pie",
    link: "https://unsplash.com/@r3dmax",
    source: "Unsplash",
    title: "Aurora Borealis"
  },
  {
    url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920&q=85",
    credit: "Su San Lee",
    link: "https://unsplash.com/@s_s_lee",
    source: "Unsplash",
    title: "Cherry Blossoms",
    culture: "japanese"
  },
  {
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=85",
    credit: "Keith Hardy",
    link: "https://unsplash.com/@keithhardy2001",
    source: "Unsplash",
    title: "Monument Valley",
    culture: "indigenous"
  },
  {
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=85",
    credit: "Federico Respini",
    link: "https://unsplash.com/@federicorespini",
    source: "Unsplash",
    title: "Golden Fields"
  },
  {
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=85",
    credit: "Sebastian Unrau",
    link: "https://unsplash.com/@sebastian_unrau",
    source: "Unsplash",
    title: "Winter Pines"
  },
  {
    url: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1920&q=85",
    credit: "Leonard Cotte",
    link: "https://unsplash.com/@leonardcotte",
    source: "Unsplash",
    title: "City at Night"
  },
  {
    url: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1920&q=85",
    credit: "Johny Goerend",
    link: "https://unsplash.com/@johnygoerend",
    source: "Unsplash",
    title: "Desert Dunes"
  },
  {
    url: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=1920&q=85",
    credit: "Josh Hild",
    link: "https://unsplash.com/@joshhild",
    source: "Unsplash",
    title: "Foggy Mountains"
  },
  {
    url: "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=1920&q=85",
    credit: "Alain Bonnardeaux",
    link: "https://unsplash.com/@alainbonnardeaux",
    source: "Unsplash",
    title: "Alpine Forest"
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=85",
    credit: "v2osk",
    link: "https://unsplash.com/@v2osk",
    source: "Unsplash",
    title: "Forest Mist"
  },
  {
    url: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1920&q=85",
    credit: "Joshua Earle",
    link: "https://unsplash.com/@joshuaearle",
    source: "Unsplash",
    title: "Mountain Hiker"
  },
  {
    url: "https://images.unsplash.com/photo-1432405972618-c6b0cfba8673?w=1920&q=85",
    credit: "Liam Pozz",
    link: "https://unsplash.com/@liampozz",
    source: "Unsplash",
    title: "Waterfall"
  },
  {
    url: "https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?w=1920&q=85",
    credit: "Denis Degioanni",
    link: "https://unsplash.com/@denisdegioanni",
    source: "Unsplash",
    title: "Starry Night Sky"
  },
  {
    url: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1920&q=85",
    credit: "Eberhard Grossgasteiger",
    link: "https://unsplash.com/@eberhardgross",
    source: "Unsplash",
    title: "Alpine Snow"
  },

  /* ── More Pexels ── */
  {
    url: "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=1920",
    credit: "Pixabay",
    link: "https://www.pexels.com/@pixabay",
    source: "Pexels",
    title: "Misty Mountains"
  },
  {
    url: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1920",
    credit: "Michael Block",
    link: "https://www.pexels.com/@michael-block-1691617",
    source: "Pexels",
    title: "Forest Road"
  },
  {
    url: "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=1920",
    credit: "Eberhard Grossgasteiger",
    link: "https://www.pexels.com/@eberhardgross",
    source: "Pexels",
    title: "Mountain Valley"
  },
  {
    url: "https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=1920",
    credit: "Emiliano Arano",
    link: "https://www.pexels.com/@emiliano-arano-167768",
    source: "Pexels",
    title: "Dramatic Clouds"
  },
  {
    url: "https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=1920",
    credit: "Pixabay",
    link: "https://www.pexels.com/@pixabay",
    source: "Pexels",
    title: "Rocky Shore"
  },
  {
    url: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920",
    credit: "James Wheeler",
    link: "https://www.pexels.com/@souvenirpixels",
    source: "Pexels",
    title: "Autumn Lake"
  },
  {
    url: "https://images.pexels.com/photos/1028600/pexels-photo-1028600.jpeg?auto=compress&cs=tinysrgb&w=1920",
    credit: "Maria Tyutina",
    link: "https://www.pexels.com/@maria-tyutina-257298",
    source: "Pexels",
    title: "Seaside Cliffs"
  },
  {
    url: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1920",
    credit: "Milo Miloezger",
    link: "https://www.pexels.com/@miloezger",
    source: "Pexels",
    title: "Winter Forest"
  },

  /* ── Boreal & Northern Forests ── */
  { url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&q=85", credit: "Kazuend", link: "https://unsplash.com/@kazuend", source: "Unsplash", title: "Tall Redwoods", culture: "indigenous" },
  { url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=85", credit: "Sebastian Unrau", link: "https://unsplash.com/@sebastian_unrau", source: "Unsplash", title: "Green Forest", culture: "indigenous" },
  { url: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1920&q=85", credit: "Robert Lukeman", link: "https://unsplash.com/@robertlukeman", source: "Unsplash", title: "Forest Stream", culture: "indigenous" },
  { url: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=1920&q=85", credit: "Sebastian Unrau", link: "https://unsplash.com/@sebastian_unrau", source: "Unsplash", title: "Misty Pine Forest", culture: "indigenous" },
  { url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1920&q=85", credit: "Todd Quackenbush", link: "https://unsplash.com/@toddquackenbush", source: "Unsplash", title: "Sunlit Trees", culture: "indigenous" },
  { url: "https://images.unsplash.com/photo-1440581572325-0bea30075d9d?w=1920&q=85", credit: "Luca Bravo", link: "https://unsplash.com/@lucabravo", source: "Unsplash", title: "Birch Forest", culture: "indigenous" },
  { url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1920&q=85", credit: "Lukasz Szmigiel", link: "https://unsplash.com/@szmigieldesign", source: "Unsplash", title: "Forest Canopy", culture: "indigenous" },
  { url: "https://images.unsplash.com/photo-1504700610630-ac6edd918aa0?w=1920&q=85", credit: "Tim Swaan", link: "https://unsplash.com/@timswaanphotography", source: "Unsplash", title: "Boreal Mist", culture: "indigenous" },

  /* ── Rivers, Lakes & Waterfalls ── */
  { url: "https://images.unsplash.com/photo-1432405972618-c6b0cfba8673?w=1920&q=85", credit: "Luca Bravo", link: "https://unsplash.com/@lucabravo", source: "Unsplash", title: "Mountain River" },
  { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=85", credit: "Lukasz Szmigiel", link: "https://unsplash.com/@szmigieldesign", source: "Unsplash", title: "Foggy Valley" },
  { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=85", credit: "Pietro De Grandi", link: "https://unsplash.com/@peter_mc_greats", source: "Unsplash", title: "Lake Reflections" },
  { url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=85", credit: "Kazuend", link: "https://unsplash.com/@kazuend", source: "Unsplash", title: "Tropical Waterfall" },
  { url: "https://images.unsplash.com/photo-1482685945432-29571f634909?w=1920&q=85", credit: "Jonatan Pie", link: "https://unsplash.com/@r3dmax", source: "Unsplash", title: "Glacial River" },
  { url: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=1920&q=85", credit: "Dave Hoefler", link: "https://unsplash.com/@davehoefler", source: "Unsplash", title: "Autumn Lake" },
  { url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1920&q=85", credit: "Daan Weijers", link: "https://unsplash.com/@daanweijer", source: "Unsplash", title: "Sunbeams Through Trees" },
  { url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1920&q=85", credit: "Robert Bye", link: "https://unsplash.com/@robertbye", source: "Unsplash", title: "Peaceful Lake" },

  /* ── Fog, Mist & Rain ── */
  { url: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=1920&q=85", credit: "Luca Bravo", link: "https://unsplash.com/@lucabravo", source: "Unsplash", title: "Foggy Mountain" },
  { url: "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=1920&q=85", credit: "Ales Krivec", link: "https://unsplash.com/@aleskrivec", source: "Unsplash", title: "Misty Hills" },
  { url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=85", credit: "Johannes Plenio", link: "https://unsplash.com/@jplenio", source: "Unsplash", title: "Fog Over Lake" },
  { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=85", credit: "Benjamin Voros", link: "https://unsplash.com/@vorosbenisop", source: "Unsplash", title: "Starry Mountain" },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85", credit: "Kalen Emsley", link: "https://unsplash.com/@kalenemsley", source: "Unsplash", title: "Mountain Peaks" },
  { url: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1920&q=85", credit: "Simon Berger", link: "https://unsplash.com/@8moments", source: "Unsplash", title: "Golden Hills" },
  { url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1920&q=85", credit: "Chandler Cruttenden", link: "https://unsplash.com/@chancruttenden", source: "Unsplash", title: "Snowy Road" },

  /* ── Dawn, Dusk & Golden Hour ── */
  { url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=85", credit: "Aron Visuals", link: "https://unsplash.com/@aronvisuals", source: "Unsplash", title: "Dramatic Sunset" },
  { url: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=85", credit: "Kym MacKinnon", link: "https://unsplash.com/@vixenly", source: "Unsplash", title: "Pink Dawn" },
  { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=85", credit: "Bailey Zindel", link: "https://unsplash.com/@baileyzindel", source: "Unsplash", title: "Valley Dawn" },
  { url: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1920&q=85", credit: "Joshua Earle", link: "https://unsplash.com/@joshuaearle", source: "Unsplash", title: "Sunrise Silhouette" },
  { url: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=1920&q=85", credit: "Joshua Earle", link: "https://unsplash.com/@joshuaearle", source: "Unsplash", title: "Forest Sunset" },
  { url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1920&q=85", credit: "Casey Horner", link: "https://unsplash.com/@mischievous_penguins", source: "Unsplash", title: "Tree Canopy Light" },
  { url: "https://images.unsplash.com/photo-1472120435266-95c21bcfbfdd?w=1920&q=85", credit: "Robert Lukeman", link: "https://unsplash.com/@robertlukeman", source: "Unsplash", title: "Golden Meadow" },

  /* ── Winter & Snow ── */
  { url: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1920&q=85", credit: "Eberhard Grossgasteiger", link: "https://unsplash.com/@eberhardgross", source: "Unsplash", title: "Winter Mountains" },
  { url: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1920&q=85", credit: "Aaron Burden", link: "https://unsplash.com/@aaronburden", source: "Unsplash", title: "Snowy Branch" },
  { url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&q=85", credit: "Ales Krivec", link: "https://unsplash.com/@aleskrivec", source: "Unsplash", title: "Frozen Lake" },
  { url: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1920&q=85", credit: "Khamkeo Vilaysing", link: "https://unsplash.com/@mahkeo", source: "Unsplash", title: "Frosty Forest" },
  { url: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=1920&q=85", credit: "Nathan Anderson", link: "https://unsplash.com/@nathananderson", source: "Unsplash", title: "Snow Peaks" },
  { url: "https://images.unsplash.com/photo-1478719059408-592965723cbc?w=1920&q=85", credit: "Simon Matzinger", link: "https://unsplash.com/@8moments", source: "Unsplash", title: "Winter Fog" },

  /* ── Coastal & Ocean ── */
  { url: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1920&q=85", credit: "Frank McKenna", link: "https://unsplash.com/@frankiefoto", source: "Unsplash", title: "Ocean Aerial" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85", credit: "Sean O.", link: "https://unsplash.com/@seano", source: "Unsplash", title: "Tropical Beach" },
  { url: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=1920&q=85", credit: "Jeremy Bishop", link: "https://unsplash.com/@jeremybishop", source: "Unsplash", title: "Sea Rocks" },
  { url: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1920&q=85", credit: "Shifaaz Shamoon", link: "https://unsplash.com/@sotti", source: "Unsplash", title: "Maldives Beach" },
  { url: "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=1920&q=85", credit: "Dan Gold", link: "https://unsplash.com/@danielcgold", source: "Unsplash", title: "Rocky Coast" },
  { url: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=1920&q=85", credit: "Anastasia Taioglou", link: "https://unsplash.com/@tfrlee", source: "Unsplash", title: "Blue Coast" },
  { url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=85", credit: "Matt Hardy", link: "https://unsplash.com/@matthardy", source: "Unsplash", title: "Ocean Waves" },

  /* ── Mountains & Valleys ── */
  { url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=85", credit: "Martin Adams", link: "https://unsplash.com/@martinadams", source: "Unsplash", title: "Himalayan Peak" },
  { url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1920&q=85", credit: "Sven Scheuermeier", link: "https://unsplash.com/@sveninho", source: "Unsplash", title: "Alpine Summit" },
  { url: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1920&q=85", credit: "Joshua Earle", link: "https://unsplash.com/@joshuaearle", source: "Unsplash", title: "Lone Wanderer" },
  { url: "https://images.unsplash.com/photo-1491466424936-e304919aada7?w=1920&q=85", credit: "Dino Reichmuth", link: "https://unsplash.com/@dinoreichmuth", source: "Unsplash", title: "Mountain Road" },
  { url: "https://images.unsplash.com/photo-1445363692815-ebcd599f7621?w=1920&q=85", credit: "Ales Krivec", link: "https://unsplash.com/@aleskrivec", source: "Unsplash", title: "Mountain Chapel" },
  { url: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=1920&q=85", credit: "Pedro Lastra", link: "https://unsplash.com/@peterlaster", source: "Unsplash", title: "Canyon Sunset" },
  { url: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=1920&q=85", credit: "Sven Fischer", link: "https://unsplash.com/@svenfischer", source: "Unsplash", title: "Swiss Alps" },

  /* ── Meadows & Wildflowers ── */
  { url: "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=1920&q=85", credit: "Joshua Harris", link: "https://unsplash.com/@joshuaharris", source: "Unsplash", title: "Wildflower Field" },
  { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=85", credit: "Luca Bravo", link: "https://unsplash.com/@lucabravo", source: "Unsplash", title: "Sunlit Meadow" },
  { url: "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=1920&q=85", credit: "Timothy Eberly", link: "https://unsplash.com/@timothyeberly", source: "Unsplash", title: "Golden Grass" },
  { url: "https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=1920&q=85", credit: "Geran de Klerk", link: "https://unsplash.com/@gerandeklerk", source: "Unsplash", title: "Lavender Rows" },
  { url: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1920&q=85", credit: "Boris Smokrovic", link: "https://unsplash.com/@borisworkshop", source: "Unsplash", title: "Bird in Flight" },

  /* ── Desert & Canyon ── */
  { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=85", credit: "Braden Jarvis", link: "https://unsplash.com/@bradenjarvis", source: "Unsplash", title: "Desert Highway" },
  { url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&q=85", credit: "Cosmic Timetraveler", link: "https://unsplash.com/@cosmictimetraveler", source: "Unsplash", title: "Desert Dunes" },
  { url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1920&q=85", credit: "Willian Justen de Vasconcellos", link: "https://unsplash.com/@willianjusten", source: "Unsplash", title: "Red Rock Canyon" },
  { url: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1920&q=85", credit: "Andrew Coelho", link: "https://unsplash.com/@andrewcoelho", source: "Unsplash", title: "Sand Ripples" },
  { url: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1920&q=85", credit: "Fabian Quintero", link: "https://unsplash.com/@fabianquintero", source: "Unsplash", title: "Lone Tree Sunset" },

  /* ── Night Sky & Stars ── */
  { url: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1920&q=85", credit: "Greg Rakozy", link: "https://unsplash.com/@grakozy", source: "Unsplash", title: "Night Sky" },
  { url: "https://images.unsplash.com/photo-1475274047050-1d0c55b91276?w=1920&q=85", credit: "Aperture Vintage", link: "https://unsplash.com/@aperturevintage", source: "Unsplash", title: "Cosmic Glow" },
  { url: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=85", credit: "Vincentiu Solomon", link: "https://unsplash.com/@vincentiu", source: "Unsplash", title: "Star Trails" },
  { url: "https://images.unsplash.com/photo-1532767153700-01f1e0bae927?w=1920&q=85", credit: "Nathan Anderson", link: "https://unsplash.com/@nathananderson", source: "Unsplash", title: "Northern Glow" },
  { url: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1920&q=85", credit: "Jeremy Thomas", link: "https://unsplash.com/@jeremythomasphoto", source: "Unsplash", title: "Galaxy View" },

  /* ── More Nature & Landscapes ── */
  { url: "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=1920&q=85", credit: "Ales Krivec", link: "https://unsplash.com/@aleskrivec", source: "Unsplash", title: "Village Valley" },
  { url: "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=1920&q=85", credit: "Eberhard Grossgasteiger", link: "https://unsplash.com/@eberhardgross", source: "Unsplash", title: "Turquoise Lake" },
  { url: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=1920&q=85", credit: "Ales Krivec", link: "https://unsplash.com/@aleskrivec", source: "Unsplash", title: "Emerald Valley" },
  { url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=85", credit: "Robert Lukeman", link: "https://unsplash.com/@robertlukeman", source: "Unsplash", title: "Green Hills" },
  { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=85", credit: "Dave Hoefler", link: "https://unsplash.com/@davehoefler", source: "Unsplash", title: "Sunbeam Valley" },
  { url: "https://images.unsplash.com/photo-1465056836900-8f1e940b2eb8?w=1920&q=85", credit: "Scott Webb", link: "https://unsplash.com/@scottwebb", source: "Unsplash", title: "Purple Flowers" },
  { url: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1920&q=85", credit: "Luca Bravo", link: "https://unsplash.com/@lucabravo", source: "Unsplash", title: "Tropical Paradise" },
  { url: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1920&q=85", credit: "Faye Cornish", link: "https://unsplash.com/@fcornish", source: "Unsplash", title: "Countryside Path" },
  { url: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1920&q=85", credit: "Ricardo Gomez Angel", link: "https://unsplash.com/@rgaleriacom", source: "Unsplash", title: "Autumn Leaves" },

  /* ── Wikimedia Commons — Classical Paintings ── */
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
    credit: "Leonardo da Vinci",
    link: "https://en.wikipedia.org/wiki/Mona_Lisa",
    source: "Wikimedia Commons",
    title: "Mona Lisa"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/VanGogh-starry_night_ballance1.jpg/1280px-VanGogh-starry_night_ballance1.jpg",
    credit: "Vincent van Gogh",
    link: "https://en.wikipedia.org/wiki/The_Starry_Night",
    source: "Wikimedia Commons",
    title: "The Starry Night"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg/1280px-The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg",
    credit: "Hieronymus Bosch",
    link: "https://en.wikipedia.org/wiki/The_Garden_of_Earthly_Delights",
    source: "Wikimedia Commons",
    title: "The Garden of Earthly Delights"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    credit: "Vincent van Gogh",
    link: "https://en.wikipedia.org/wiki/Starry_Night_Over_the_Rh%C3%B4ne",
    source: "Wikimedia Commons",
    title: "Café Terrace at Night"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Meisje_met_de_parel.jpg/800px-Meisje_met_de_parel.jpg",
    credit: "Johannes Vermeer",
    link: "https://en.wikipedia.org/wiki/Girl_with_a_Pearl_Earring",
    source: "Wikimedia Commons",
    title: "Girl with a Pearl Earring"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Parc_Monceau_%28Monet%29.jpg/1280px-Parc_Monceau_%28Monet%29.jpg",
    credit: "Claude Monet",
    link: "https://en.wikipedia.org/wiki/Claude_Monet",
    source: "Wikimedia Commons",
    title: "Parc Monceau"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg",
    credit: "Vincent van Gogh",
    link: "https://en.wikipedia.org/wiki/Wheatfield_with_Crows",
    source: "Wikimedia Commons",
    title: "Wheatfield with Crows"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1280px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg",
    credit: "Georges Seurat",
    link: "https://en.wikipedia.org/wiki/A_Sunday_Afternoon_on_the_Island_of_La_Grande_Jatte",
    source: "Wikimedia Commons",
    title: "Sunday on La Grande Jatte"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat_03.jpg/1200px-Cat_03.jpg",
    credit: "Alvesgaspar",
    link: "https://commons.wikimedia.org/wiki/File:Cat_03.jpg",
    source: "Wikimedia Commons",
    title: "European Cat"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg",
    credit: "Katsushika Hokusai",
    link: "https://en.wikipedia.org/wiki/The_Great_Wave_off_Kanagawa",
    source: "Wikimedia Commons",
    title: "The Great Wave",
    culture: "japanese"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Albert_Bierstadt_-_Among_the_Sierra_Nevada%2C_California_-_Google_Art_Project.jpg/1280px-Albert_Bierstadt_-_Among_the_Sierra_Nevada%2C_California_-_Google_Art_Project.jpg",
    credit: "Albert Bierstadt",
    link: "https://en.wikipedia.org/wiki/Albert_Bierstadt",
    source: "Wikimedia Commons",
    title: "Among the Sierra Nevada"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/800px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
    credit: "Caspar David Friedrich",
    link: "https://en.wikipedia.org/wiki/Wanderer_above_the_Sea_of_Fog",
    source: "Wikimedia Commons",
    title: "Wanderer Above the Sea of Fog"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg",
    credit: "Claude Monet",
    link: "https://en.wikipedia.org/wiki/Impression,_Sunrise",
    source: "Wikimedia Commons",
    title: "Impression, Sunrise"
  },

  /* ── Greco-Roman Classical Art ── */
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Socrates_Louvre.jpg/800px-Socrates_Louvre.jpg",
    credit: "Bust of Socrates — Roman copy after Greek original, 1st–2nd c. CE",
    link: "https://commons.wikimedia.org/wiki/File:Socrates_Louvre.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "greco-roman"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Pope-Innocent-X-Velazquez.jpg/1024px-Pope-Innocent-X-Velazquez.jpg",
    credit: "The Battle of Issus (detail) — Albrecht Altdorfer, 1529",
    link: "https://commons.wikimedia.org/wiki/File:Albrecht_Altdorfer_-_The_Battle_of_Alexander_at_Issus_-_WGA00326.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "greco-roman"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Raffael_058.jpg/1280px-Raffael_058.jpg",
    credit: "The Parnassus — Raphael, 1510–1511",
    link: "https://commons.wikimedia.org/wiki/File:Raffael_058.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "greco-roman"
  },

  /* ── Chinese Landscape Art ── */
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Fan_Kuan-_Travelers_Among_Mountains_and_Streams.jpg/800px-Fan_Kuan-_Travelers_Among_Mountains_and_Streams.jpg",
    credit: "Travelers Among Mountains and Streams — Fan Kuan, c. 1000 CE",
    link: "https://commons.wikimedia.org/wiki/File:Fan_Kuan-_Travelers_Among_Mountains_and_Streams.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "chinese"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Guo_Xi-_Early_Spring.jpg/800px-Guo_Xi-_Early_Spring.jpg",
    credit: "Early Spring — Guo Xi, 1072 CE",
    link: "https://commons.wikimedia.org/wiki/File:Guo_Xi-_Early_Spring.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "chinese"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Wang_Ximeng_-_A_Thousand_Li_of_Rivers_and_Mountains.jpg/1280px-Wang_Ximeng_-_A_Thousand_Li_of_Rivers_and_Mountains.jpg",
    credit: "A Thousand Li of Rivers and Mountains — Wang Ximeng, 1113 CE",
    link: "https://commons.wikimedia.org/wiki/File:Wang_Ximeng_-_A_Thousand_Li_of_Rivers_and_Mountains.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "chinese"
  },

  /* ── Japanese Woodblock Prints ── */
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Hokusai_-_Red_Fuji_southern_wind_clear_morning.jpg/1280px-Hokusai_-_Red_Fuji_southern_wind_clear_morning.jpg",
    credit: "Red Fuji (South Wind, Clear Sky) — Katsushika Hokusai, c. 1831",
    link: "https://commons.wikimedia.org/wiki/File:Hokusai_-_Red_Fuji_southern_wind_clear_morning.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "japanese"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hiroshige_Ohashi_Atake_no_Yudachi.jpg/1280px-Hiroshige_Ohashi_Atake_no_Yudachi.jpg",
    credit: "Sudden Shower over Shin-Ohashi Bridge — Hiroshige, 1857",
    link: "https://commons.wikimedia.org/wiki/File:Hiroshige_Ohashi_Atake_no_Yudachi.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "japanese"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Hiroshige_-_Sixty-nine_Stations_of_the_Kisokaido_-_Station_67_-_Oiwake.jpg/1280px-Hiroshige_-_Sixty-nine_Stations_of_the_Kisokaido_-_Station_67_-_Oiwake.jpg",
    credit: "Snowstorm at Kanbara — Hiroshige, c. 1833",
    link: "https://commons.wikimedia.org/wiki/File:Hiroshige_Kanbara_yoru_no_yuki.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "japanese"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hiroshige_-_Hundred_Famous_Views_of_Edo_-_Plum_Garden_at_Kamata.jpg/800px-Hiroshige_-_Hundred_Famous_Views_of_Edo_-_Plum_Garden_at_Kamata.jpg",
    credit: "Plum Garden at Kameido — Hiroshige, 1857",
    link: "https://commons.wikimedia.org/wiki/File:Hiroshige_Kameido_Umeyashiki.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "japanese"
  },

  /* ── Buddhist & South Asian Art ── */
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Borobudur-Nothwest-view.jpg/1280px-Borobudur-Nothwest-view.jpg",
    credit: "Borobudur Temple, Java — 9th century CE",
    link: "https://commons.wikimedia.org/wiki/File:Borobudur-Nothwest-view.jpg",
    source: "Wikimedia Commons · CC BY-SA",
    culture: "buddhist"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Ajanta_cave2_1.jpg/1280px-Ajanta_cave2_1.jpg",
    credit: "Ajanta Cave Paintings, India — 2nd century BCE – 5th century CE",
    link: "https://commons.wikimedia.org/wiki/File:Ajanta_cave2_1.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "buddhist"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tibetan_Buddhist_Thangka_Painting.jpg/800px-Tibetan_Buddhist_Thangka_Painting.jpg",
    credit: "Tibetan Buddhist Thangka — 18th century",
    link: "https://commons.wikimedia.org/wiki/File:Medicine_Buddha_Thangka.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "buddhist"
  },

  /* ── Persian & Sufi Art ── */
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Rumi_Masnavi_Manuscript_Page.jpg/800px-Rumi_Masnavi_Manuscript_Page.jpg",
    credit: "Masnavi Manuscript, Persia — 13th–14th century",
    link: "https://commons.wikimedia.org/wiki/File:Masnavi_Manuscript_Page.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "persian"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Sultan_Muhammad_-_Court_of_Gayumars_-_Google_Art_Project.jpg/800px-Sultan_Muhammad_-_Court_of_Gayumars_-_Google_Art_Project.jpg",
    credit: "Court of Gayumars — Sultan Muhammad, c. 1522–1525",
    link: "https://commons.wikimedia.org/wiki/File:Sultan_Muhammad_-_Court_of_Gayumars_-_Google_Art_Project.jpg",
    source: "Wikimedia Commons · Public Domain",
    culture: "persian"
  },
];

// Remove duplicate entries (same photo listed in multiple culture categories).
// Rebuild via filter (O(n)) instead of splice-in-loop (O(n²)).
(function() {
  const _seen = new Set();
  const _deduped = BACKGROUNDS.filter(bg => {
    if (_seen.has(bg.url)) return false;
    _seen.add(bg.url);
    return true;
  });
  BACKGROUNDS.length = 0;
  BACKGROUNDS.push(..._deduped);
})();
