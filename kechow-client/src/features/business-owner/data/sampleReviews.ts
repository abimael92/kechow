import type { Review } from '../types';

export const sampleReviews: Review[] = [
	{
		id: '1',
		customerName: 'John Doe',
		rating: 5,
		comment:
			'Absolutely amazing food! The Margherita pizza was perfect and the delivery was super fast. Will definitely order again!',
		date: '2024-01-15',
		verified: true,
		orderItems: ['Margherita Pizza', 'Caesar Salad'],
		helpfulCount: 12,
	},
	{
		id: '2',
		customerName: 'Sarah Wilson',
		rating: 4,
		comment:
			'Great food quality and taste. The pasta was delicious but the delivery took a bit longer than expected. Overall satisfied!',
		date: '2024-01-14',
		verified: true,
		orderItems: ['Chicken Alfredo', 'Garlic Bread'],
		response:
			"Thank you for your feedback! We're working on improving our delivery times.",
		helpfulCount: 8,
	},
	{
		id: '3',
		customerName: 'Mike Johnson',
		rating: 5,
		comment:
			'Best pizza in town! Fresh ingredients, perfect crust, and excellent service. The tiramisu was the perfect ending to our meal.',
		date: '2024-01-13',
		verified: true,
		orderItems: ['Pepperoni Pizza', 'Tiramisu'],
		helpfulCount: 15,
	},
	{
		id: '4',
		customerName: 'Emily Chen',
		rating: 3,
		comment:
			'Food was okay, but not exceptional. The salad was fresh but the pizza was a bit too salty for my taste.',
		date: '2024-01-12',
		verified: true,
		orderItems: ['Caesar Salad', 'Margherita Pizza'],
		helpfulCount: 3,
	},
	{
		id: '5',
		customerName: 'David Brown',
		rating: 5,
		comment:
			'Outstanding service and food quality! The staff is friendly and the food always arrives hot and fresh.',
		date: '2024-01-11',
		verified: true,
		orderItems: ['BBQ Pizza', 'Wings'],
		response:
			'Thank you so much for your kind words! We appreciate your loyalty.',
		helpfulCount: 20,
	},
];
