import type { Review } from '../types';

export const sampleReviews: Review[] = [
	{
		id: '1',
		customerName: 'Carlos Méndez',
		rating: 5,
		comment:
			'¡Las mejores gorditas de Chihuahua! La masa estaba perfecta y el chile colorado espectacular. El servicio fue muy rápido y amable.',
		date: '2024-02-15',
		verified: true,
		orderItems: ['Gorditas de chile colorado', 'Refresco de tamarindo'],
		helpfulCount: 24,
	},
	{
		id: '2',
		customerName: 'Ana Rodríguez',
		rating: 4,
		comment:
			'Los burritos de machaca estaban deliciosos, aunque hubiera preferido más picante. La entrega fue puntual y la comida llegó caliente.',
		date: '2024-02-14',
		verified: true,
		orderItems: ['Burritos de machaca', 'Cebollitas asadas'],
		response:
			'¡Gracias por tu comentario! En tu próximo pedido puedes solicitar salsa extra picante sin costo adicional.',
		helpfulCount: 18,
	},
	{
		id: '3',
		customerName: 'Miguel Torres',
		rating: 5,
		comment:
			'¡Auténtico sabor chihuahuense! Los cortes de carne asada eran de primera calidad y las tortillas hechas a mano. El servicio impecable.',
		date: '2024-02-13',
		verified: true,
		orderItems: ['Carne asada estilo norteño', 'Frijoles charros'],
		helpfulCount: 32,
	},
	{
		id: '4',
		customerName: 'Lucía Fernández',
		rating: 3,
		comment:
			'La comida estaba bien, pero esperaba más sabor en los chiles rellenos. El guacamole sí estaba excelente y fresco.',
		date: '2024-02-12',
		verified: true,
		orderItems: ['Chiles rellenos', 'Guacamole tradicional'],
		helpfulCount: 7,
	},
	{
		id: '5',
		customerName: 'José Luis Herrera',
		rating: 5,
		comment:
			'¡Increíble sabor casero! Las enchiladas rojas me recordaron a las de mi abuela. El menudito del sábado es una delicia.',
		date: '2024-02-11',
		verified: true,
		orderItems: ['Enchiladas rojas', 'Menudo estilo norteño'],
		response:
			'¡Muchas gracias! Nos enorgullece mantener las recetas tradicionales de la región.',
		helpfulCount: 28,
	},
	{
		id: '6',
		customerName: 'Patricia Vargas',
		rating: 4,
		comment:
			'Muy buenos tacos de adobada, aunque la salsa podría ser más picante. El horchata estaba perfecta y no muy dulce.',
		date: '2024-02-10',
		verified: true,
		orderItems: ['Tacos de adobada', 'Horchata fresca'],
		helpfulCount: 15,
	},
	{
		id: '7',
		customerName: 'Roberto Sánchez',
		rating: 5,
		comment:
			'El mejor discada que he probado fuera de mi casa. Ingredientes frescos y bien balanceados. ¡Totalmente recomendado!',
		date: '2024-02-09',
		verified: true,
		orderItems: ['Discada norteña', 'Tortillas de harina'],
		helpfulCount: 41,
	},
	{
		id: '8',
		customerName: 'Gabriela Morales',
		rating: 2,
		comment:
			'Los tamales estaban secos y les faltaba salsa. El atole de guayaba estaba muy aguado. No cumplió mis expectativas.',
		date: '2024-02-08',
		verified: false,
		orderItems: ['Tamales de rajas', 'Atole de guayaba'],
		helpfulCount: 5,
	},
	{
		id: '9',
		customerName: 'Fernando Castillo',
		rating: 5,
		comment:
			'¡Sabor auténtico de Chihuahua en cada bocado! Los chilakos estaban perfectos y el servicio fue excepcional. Volveré pronto.',
		date: '2024-02-07',
		verified: true,
		orderItems: ['Chilakos norteños', 'Agua de jamaica'],
		response:
			'¡Nos alegra que disfrutaras nuestros platillos tradicionales! Te esperamos pronto.',
		helpfulCount: 36,
	},
	{
		id: '10',
		customerName: 'Sofía Ramírez',
		rating: 4,
		comment:
			'Buena relación calidad-precio. Los quesadillas de flor de calabaza estaban sabrosos, aunque hubiera preferido más queso.',
		date: '2024-02-06',
		verified: true,
		orderItems: ['Quesadillas de flor', 'Salsa molcajeteada'],
		helpfulCount: 12,
	},
];
