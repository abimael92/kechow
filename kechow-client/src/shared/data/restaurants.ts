import * as restaurantImages from '../../assets/index';

export type MenuItem = {
	id: number;
	name: string;
	description: string;
	image: string;
	price: number;
	stock?: number;
};

export type Restaurant = {
	id: number;
	name: string;
	description: string;
	image: string;
	menu: MenuItem[];
};

export const restaurants = [
	{
		id: 1,
		name: 'Porto Chico',
		description: 'Restaurante de mariscos',
		image: restaurantImages.portoChico,
		menu: [
			{
				id: 101,
				name: 'Ceviche clásico',
				description: 'Pescado marinado en jugo de limón con vegetales frescos.',
				image: '/images/placeholder-image.png',
				price: 120,
				stock: 8,
			},
			{
				id: 102,
				name: 'Camarones al mojo de ajo',
				description: 'Camarones salteados con ajo y mantequilla.',
				image: '/images/placeholder-image.png',
				price: 150,
			},
			{
				id: 103,
				name: 'Cocktail de mariscos',
				description: 'Mezcla de mariscos servidos en salsa de tomate.',
				image: '/images/placeholder-image.png',
				price: 130,
				stock: 3,
			},
			{
				id: 104,
				name: 'Filete empanizado',
				description: 'Filete de pescado empanizado con guarnición.',
				image: '/images/placeholder-image.png',
				price: 140,
				stock: 2,
			},
		],
		rating: 4.3,
	},
	{
		id: 2,
		name: 'Menuderia IME',
		description: 'Menudería tradicional',
		image: restaurantImages.menuderiaIme,
		menu: [
			{
				id: 201,
				name: 'Menudo rojo',
				description: 'Menudo tradicional con chile rojo.',
				image: 'https://source.unsplash.com/80x80/?menudo',
				price: 95,
			},
			{
				id: 202,
				name: 'Menudo blanco',
				description: 'Menudo estilo norteño sin chile.',
				image: 'https://source.unsplash.com/80x80/?soup',
				price: 95,
			},
			{
				id: 203,
				name: 'Tacos de menudo',
				description: 'Tortillas rellenas con carne de menudo.',
				image: 'https://source.unsplash.com/80x80/?taco',
				price: 85,
			},
			{
				id: 204,
				name: 'Tortillas hechas a mano',
				description: 'Tortillas frescas hechas al momento.',
				image: 'https://source.unsplash.com/80x80/?tortilla',
				price: 20,
			},
		],
		rating: 4.7,
	},
	{
		id: 3,
		name: 'Tacos Cano',
		description: 'Taquería',
		image: restaurantImages.tacosCano,
		menu: [
			{
				id: 301,
				name: 'Tacos al pastor',
				description: 'Carne marinada al trompo con piña.',
				image: 'https://source.unsplash.com/80x80/?pastor-taco',
				price: 18,
			},
			{
				id: 302,
				name: 'Tacos de carne asada',
				description: 'Tacos con carne de res asada.',
				image: 'https://source.unsplash.com/80x80/?carne-asada',
				price: 20,
			},
			{
				id: 303,
				name: 'Quesadillas',
				description: 'Tortilla con queso fundido y guarniciones.',
				image: 'https://source.unsplash.com/80x80/?quesadilla',
				price: 25,
			},
			{
				id: 304,
				name: 'Salsas caseras',
				description: 'Variedad de salsas picantes y suaves.',
				image: 'https://source.unsplash.com/80x80/?salsa',
				price: 0,
			},
		],
		rating: 4.1,
	},
	{
		id: 4,
		name: 'La Terraza',
		description: 'Restaurante familiar',
		image: restaurantImages.laTerraza,
		menu: [
			{
				id: 401,
				name: 'Desayunos completos',
				description: 'Huevos, frijoles, tortillas y café.',
				image: 'https://source.unsplash.com/80x80/?breakfast',
				price: 90,
			},
			{
				id: 402,
				name: 'Platos regionales',
				description: 'Especialidades de la región con ingredientes locales.',
				image: 'https://source.unsplash.com/80x80/?mexican-food',
				price: 110,
			},
			{
				id: 403,
				name: 'Ensaladas',
				description: 'Variedad de ensaladas frescas y saludables.',
				image: 'https://source.unsplash.com/80x80/?salad',
				price: 70,
			},
			{
				id: 404,
				name: 'Jugos naturales',
				description: 'Jugos frescos de frutas de temporada.',
				image: 'https://source.unsplash.com/80x80/?juice',
				price: 40,
			},
		],
		rating: 4.0,
	},
	{
		id: 5,
		name: 'Restaurante El Capi',
		description: 'Comida mexicana',
		image: restaurantImages.restauranteElCapi,
		menu: [
			{
				id: 501,
				name: 'Carnes asadas',
				description: 'Cortes selectos a la parrilla.',
				image: 'https://source.unsplash.com/80x80/?grilled-meat',
				price: 150,
			},
			{
				id: 502,
				name: 'Tacos',
				description: 'Tacos variados con guarniciones tradicionales.',
				image: 'https://source.unsplash.com/80x80/?tacos',
				price: 20,
			},
			{
				id: 503,
				name: 'Guisados',
				description: 'Guisos caseros con sabor tradicional.',
				image: 'https://source.unsplash.com/80x80/?stew',
				price: 100,
			},
			{
				id: 504,
				name: 'Postres tradicionales',
				description: 'Dulces típicos mexicanos.',
				image: 'https://source.unsplash.com/80x80/?dessert',
				price: 60,
			},
		],
		rating: 4.2,
	},
	{
		id: 6,
		name: 'Hamburguesas De Chito',
		description: 'Hamburguesería',
		image: restaurantImages.hamburguesasDeChito,
		menu: [
			{
				id: 601,
				name: 'Hamburguesas clásicas',
				description: 'Hamburguesa con lechuga, tomate y queso.',
				image: 'https://source.unsplash.com/80x80/?burger',
				price: 85,
			},
			{
				id: 602,
				name: 'Hamburguesa con queso y tocino',
				description: 'Clásica con extra queso y tocino crujiente.',
				image: 'https://source.unsplash.com/80x80/?bacon-burger',
				price: 100,
			},
			{
				id: 603,
				name: 'Papas fritas',
				description: 'Papas fritas crujientes con sal.',
				image: 'https://source.unsplash.com/80x80/?fries',
				price: 40,
			},
			{
				id: 604,
				name: 'Malteadas',
				description: 'Malteadas cremosas de vainilla, chocolate y fresa.',
				image: 'https://source.unsplash.com/80x80/?milkshake',
				price: 55,
			},
		],
		rating: 4.1,
	},
	{
		id: 7,
		name: 'El Charco de la Rana',
		description: 'Restaurante de comida mexicana',
		image: restaurantImages.elCharcoDeLaRana,
		menu: [
			{
				id: 701,
				name: 'Especialidades regionales',
				description: 'Platos típicos de la región.',
				image: 'https://source.unsplash.com/80x80/?regional-food',
				price: 120,
			},
			{
				id: 702,
				name: 'Sopas',
				description: 'Variedad de sopas caseras.',
				image: 'https://source.unsplash.com/80x80/?soup',
				price: 80,
			},
			{
				id: 703,
				name: 'Antojitos',
				description: 'Botanas y antojitos mexicanos.',
				image: 'https://source.unsplash.com/80x80/?antojitos',
				price: 60,
			},
			{
				id: 704,
				name: 'Bebidas tradicionales',
				description: 'Aguas frescas y bebidas típicas.',
				image: 'https://source.unsplash.com/80x80/?agua-fresca',
				price: 35,
			},
		],
		rating: 4.3,
	},
	{
		id: 8,
		name: 'Gorditas Y Tortillas CHANITO',
		description: 'Comida rápida tradicional',
		image: restaurantImages.gorditasYTortillasChanito,
		menu: [
			{
				id: 801,
				name: 'Gorditas rellenas',
				description: 'Gorditas rellenas de diversos guisos.',
				image: 'https://source.unsplash.com/80x80/?gorditas',
				price: 50,
			},
			{
				id: 802,
				name: 'Tortillas hechas a mano',
				description: 'Tortillas frescas y calientes.',
				image: 'https://source.unsplash.com/80x80/?tortilla',
				price: 20,
			},
			{
				id: 803,
				name: 'Salsas variadas',
				description: 'Diferentes salsas para acompañar.',
				image: 'https://source.unsplash.com/80x80/?salsa',
				price: 0,
			},
		],
		rating: 4.4,
	},
	{
		id: 9,
		name: 'Los Girasoles',
		description: 'Restaurante familiar',
		image: restaurantImages.losGirasoles,
		menu: [
			{
				id: 901,
				name: 'Platillos mexicanos',
				description: 'Variedad de platillos tradicionales.',
				image: 'https://source.unsplash.com/80x80/?mexican-food',
				price: 110,
			},
			{
				id: 902,
				name: 'Desayunos',
				description: 'Desayunos completos y variados.',
				image: 'https://source.unsplash.com/80x80/?breakfast',
				price: 90,
			},
			{
				id: 903,
				name: 'Café',
				description: 'Café tradicional y especialidades.',
				image: 'https://source.unsplash.com/80x80/?coffee',
				price: 30,
			},
			{
				id: 904,
				name: 'Jugos naturales',
				description: 'Jugos frescos de temporada.',
				image: 'https://source.unsplash.com/80x80/?juice',
				price: 40,
			},
		],
		rating: 4.1,
	},
	{
		id: 10,
		name: 'Green Leaf',
		description: 'Restaurante vegano y vegetariano',
		menu: [
			{
				id: 1001,
				name: 'Ensaladas frescas',
				description: 'Mezcla de verduras frescas con aderezos.',
				image: 'https://source.unsplash.com/80x80/?salad',
				price: 90,
			},
			{
				id: 1002,
				name: 'Wraps veganos',
				description: 'Tortillas rellenas con vegetales y hummus.',
				image: 'https://source.unsplash.com/80x80/?vegan-wrap',
				price: 85,
			},
			{
				id: 1003,
				name: 'Jugos naturales',
				description: 'Jugos frescos de frutas orgánicas.',
				image: 'https://source.unsplash.com/80x80/?juice',
				price: 45,
			},
			{
				id: 1004,
				name: 'Postres veganos',
				description: 'Postres sin ingredientes animales.',
				image: 'https://source.unsplash.com/80x80/?vegan-dessert',
				price: 60,
			},
		],
		rating: 4.5,
	},
];
