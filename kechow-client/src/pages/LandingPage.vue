<template>
	<div class="landing-root min-h-full bg-app dark:bg-gray-900 text-gray-900 dark:text-gray-100 ">
		<main>
			<!-- Hero Section -->
			<section class="relative overflow-hidden pt-20 pb-32">
				<!-- Animated Background -->
				<div class="absolute inset-0 opacity-5">
					<div class="absolute inset-0" :style="animatedBackground"></div>
				</div>

				<div class="container mx-auto px-4 relative z-10">
					<div class="grid lg:grid-cols-2 gap-12 items-center">
						<!-- Hero Content -->
						<div class="space-y-8">
							<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 mb-4">
								<Sparkles class="w-4 h-4 text-primary-500" />
								<span class="text-sm font-medium text-primary-700 dark:text-primary-300">
									¡Nuevo en Jiménez!
								</span>
							</div>

							<h1 class="text-4xl md:text-6xl font-chewy leading-tight">
								<span class="bg-gradient-to-r from-primary-500 to-orange-800 bg-clip-text text-transparent">
									Tu comida favorita,
								</span>
								<br />
								<span class="text-accent-500 dark:text-accent-300">
									en minutos
								</span>
							</h1>

							<p class="text-xl text-secondary-600 dark:text-primary-300 leading-relaxed">
								Descubre los mejores restaurantes de Jiménez desde la comodidad de tu hogar.
								Pedidos rápidos, seguimiento en tiempo real y entrega directa a tu puerta.
							</p>

							<!-- Stats -->
							<div class="grid grid-cols-3 gap-4">
								<div class="text-center p-4 rounded-xl bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 backdrop-blur-sm">
									<div class="text-2xl font-bold text-primary-600 dark:text-primary-400">30min</div>
									<div class="text-sm text-primary-900 dark:text-primary-300">Entrega promedio</div>
								</div>
								<div class="text-center p-4 rounded-xl bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 backdrop-blur-sm">
									<div class="text-2xl font-bold text-primary-600 dark:text-primary-400">50+</div>
									<div class="text-sm text-primary-900 dark:text-primary-300">Restaurantes</div>
								</div>
								<div class="text-center p-4 rounded-xl bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 backdrop-blur-sm">
									<div class="text-2xl font-bold text-primary-600 dark:text-primary-400">4.8★</div>
									<div class="text-sm text-primary-900 dark:text-primary-300">Calificación</div>
								</div>
							</div>

							<!-- CTA Buttons -->
							<div class="flex flex-wrap gap-4">
								<BaseButton 
									size="lg"
									class="bg-primary-500 hover:bg-primary-400 text-white"
									@click="goToOrder"
								>
									<template #icon>
										<ShoppingBag class="w-5 h-5" />
									</template>
									Ordenar Ahora
								</BaseButton>
								<BaseButton 
									size="lg"
									variant="outline"
									class="border-accent-500 border-2 text-accent-500 bg-white hover:bg-accent-500 hover:text-white dark:hover:bg-primary-900/20"
									@click="scrollToFeatures"
								>
									<template #icon>
										<Sparkles class="w-5 h-5" />
									</template>
									Ver Características
								</BaseButton>
							</div>
						</div>

						<!-- Hero Image/Animation -->
						<div class="relative">
							<div class="relative rounded-3xl overflow-hidden shadow-2xl">
								<!-- Food Image -->
								<div class="aspect-square bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 flex items-center justify-center">
									<div class="text-center p-8">
										<div class=" mb-2 animate-bounce">
											<img
												src="/images/kechow_puppy.png" 
												alt="Delicious Food"
											/>
										</div>
										<p class="text-2xl font-chewy text-primary-700 dark:text-primary-300">
											¡Comida deliciosa en camino!
										</p>
									</div>
								</div>

								<!-- Floating Delivery Animation -->
								<!-- <div class="absolute -bottom-6 -right-6 w-32 h-32">
									<div class="relative w-full h-full">
										 Delivery Scooter
										<div class="absolute inset-0 animate-pulse-slow">
											<Bike class="w-full h-full text-primary-500" />
										</div>
										Delivery Route -
										<div class="absolute inset-0 border-2 border-dashed border-primary-300 rounded-full animate-spin-slow"></div>
									</div>
								</div> -->
							</div>

							<!-- Floating Elements -->
							<div class="absolute -top-6 -left-6 w-24 h-24 bg-primary-400/20 rounded-full blur-xl animate-ping-slow"></div>
							<div class="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-600/10 rounded-full blur-xl animate-pulse"></div>
						</div>
					</div>
				</div>
			</section>

			<!-- Features Section -->
			<section id="features" class="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
				<div class="container mx-auto px-4">
					<div class="text-center mb-16">
						<h2 class="text-3xl md:text-4xl font-chewy mb-4">
							<span class="bg-gradient-to-r from-primary-500 to-primary-800 bg-clip-text text-transparent text-5xl">
								¿Por qué elegir Kechow?
							</span>
						</h2>
						<p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							La mejor experiencia de comida a domicilio en Jiménez
						</p>
					</div>

					<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<FeatureCard
						v-for="(feature, index) in features"
							:key="feature.title"
							:icon="feature.icon"
							:title="feature.title"
							:description="feature.description"
							:color="feature.color" 
						/>
					</div>
				</div>
			</section>

			<!-- Popular Restaurants -->
			<!-- <section id="restaurants" class="py-20">
				<div class="container mx-auto px-4">
					<div class="text-center mb-16">
						<h2 class="text-3xl md:text-4xl font-chewy mb-4">
							<span class="bg-gradient-to-r from-primary-500 to-primary-800 bg-clip-text text-transparent text-5xl">
								Restaurantes Destacados
							</span>
						</h2>
						<p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Los favoritos de Jiménez a solo un clic de distancia
						</p>
					</div>

					<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<RestaurantCard
							v-for="restaurant in popularRestaurants"
							:key="restaurant.id"
							:restaurant="restaurant"
						/>
					</div>

					<div class="text-center mt-12">
						<BaseButton 
							variant="outline"
							class="border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
							@click="viewAllRestaurants"
						>
							Ver todos los restaurantes
						</BaseButton>
					</div>
				</div>
			</section> -->

			<!-- How It Works -->
			<section id="how-it-works" class="py-20 ">
				<div class="container mx-auto px-4">
					<div class="text-center mb-16">
						<h2 class="text-3xl md:text-4xl font-chewy mb-4">
							<span class="bg-gradient-to-r from-primary-500 to-primary-800 bg-clip-text text-transparent text-5xl">
							¿Cómo funciona?
							</span>
						</h2>
						<p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Ordenar nunca fue tan fácil
						</p>
					</div>

					<div class="grid md:grid-cols-4 gap-8">
						<StepCard
							v-for="(step, index) in steps"
							:key="step.title"
							:number="index + 1"
							:title="step.title"
							:description="step.description"
							:icon="step.icon"
						/>
					</div>
				</div>
			</section>

			<!-- Testimonials -->
			<section id="testimonials"  class="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
				<div class="container mx-auto px-4">
					<div class="text-center mb-16">
						<h2 class="text-3xl md:text-4xl font-chewy mb-4">
							<span class="bg-gradient-to-r from-primary-500 to-primary-800 bg-clip-text text-transparent text-5xl">
								Lo que dicen nuestros clientes
							</span>
						</h2>
					</div>

					<div class="grid md:grid-cols-3 gap-8">
						<TestimonialCard
							v-for="testimonial in testimonials"
							:key="testimonial.name"
							:name="testimonial.name"
							:text="testimonial.text"
							:rating="testimonial.rating"
							:avatar="testimonial.avatar"
						/>
					</div>
				</div>
			</section>

			<!-- CTA Section -->
			<section class="py-20">
				<div class="container mx-auto px-4">
					<div class="bg-gradient-to-r from-accent-400/90 to-accent-500/90 rounded-3xl p-12 text-center relative overflow-hidden">
						<!-- Background Pattern -->
						<div class="absolute inset-0 opacity-10">
							<div class="absolute inset-0" :style="animatedBackground"></div>
						</div>

						<div class="relative z-10">
							<h2 class="text-3xl md:text-4xl font-chewy mb-6 text-white">
								¿Listo para saborear Jiménez?
							</h2>
							<p class="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
								Únete a miles de personas que ya disfrutan de la mejor comida local
							</p>
							<div class="flex flex-col sm:flex-row gap-4 justify-center">
								<BaseButton 
									size="lg"
									class="bg-accent-800 hover:bg-accent-600 text-white"
									@click="goToOrder"
								>
									<template #icon>
										<ShoppingBag class="w-5 h-5" />
									</template>
									Ordenar Ahora
								</BaseButton>
								<BaseButton 
									size="lg"
									variant="outline"
									class="border-accent-500 border-2 text-accent-500 bg-white hover:bg-accent-500 hover:text-white dark:hover:bg-primary-900/20"
									@click="scrollToFeatures"
								>
									<template #icon>
										<Sparkles class="w-5 h-5" />
									</template>
									Ver Características
								</BaseButton>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import BaseButton from '@/shared/ui/BaseButton.vue';
import FeatureCard from '@/components/landing/FeatureCard.vue'
import RestaurantCard from '@/components/landing/RestaurantCard.vue'
import StepCard from '@/components/landing/StepCard.vue'
import TestimonialCard from '@/components/landing/TestimonialCard.vue'
import { 
	ShoppingBag, 
	Sparkles, 
	Clock, 
	Shield, 
	Truck, 
	MapPin, 
	Bike,
	Search,
	Smartphone,
	CreditCard,
	CheckCircle
} from 'lucide-vue-next'

const router = useRouter()

const goToOrder = () => {
	router.push('/restaurants')
}

const scrollToFeatures = () => {
	const element = document.getElementById('features')
	if (element) {
		element.scrollIntoView({ behavior: 'smooth' })
	}
}

const viewAllRestaurants = () => {
	router.push('/restaurants')
}

// Animated background pattern
const animatedBackground = {
	backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B00' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
	backgroundSize: '60px 60px'
}

// Features data
const features = [
	{
		icon: Clock,
		title: 'Entrega Rápida',
		description: '30 minutos o menos garantizados en Jiménez',
		color: 'primary' as const
	},
	{
		icon: Shield,
		title: 'Comida Segura',
		description: 'Protocolos de higiene y empaque sellado',
		color: 'accent' as const
	},
	{
		icon: Truck,
		title: 'Seguimiento en Vivo',
		description: 'Sigue a tu repartidor en tiempo real',
		color: 'primary' as const
	},
	{
		icon: MapPin,
		title: 'Cobertura Total',
		description: 'Entregamos en toda Jiménez',
		color: 'accent' as const
	},
	{
		icon: Sparkles,
		title: 'Calidad Premium',
		description: 'Solo restaurantes verificados',
		color: 'primary' as const
	},
	{
		icon: CheckCircle,
		title: 'Pago Seguro',
		description: 'Múltiples métodos de pago',
		color: 'accent' as const
	}
]

// Popular restaurants
const popularRestaurants = [
	{
		id: 1,
		name: 'Taquería El Güero',
		cuisine: 'Mexicana',
		rating: 4.8,
		deliveryTime: '25-30 min',
		image: '/images/restaurants/taqueria.jpg'
	},
	{
		id: 2,
		name: 'Pizzas Don Pepe',
		cuisine: 'Italiana',
		rating: 4.6,
		deliveryTime: '30-35 min',
		image: '/images/restaurants/pizza.jpg'
	},
	{
		id: 3,
		name: 'Hamburguesas El Chavo',
		cuisine: 'Americana',
		rating: 4.7,
		deliveryTime: '20-25 min',
		image: '/images/restaurants/burgers.jpg'
	},
	{
		id: 4,
		name: 'Sushi House',
		cuisine: 'Japonesa',
		rating: 4.9,
		deliveryTime: '35-40 min',
		image: '/images/restaurants/sushi.jpg'
	},
	{
		id: 5,
		name: 'Tortas Ahogadas',
		cuisine: 'Mexicana',
		rating: 4.5,
		deliveryTime: '25-30 min',
		image: '/images/restaurants/tortas.jpg'
	},
	{
		id: 6,
		name: 'Cafetería Central',
		cuisine: 'Café & Postres',
		rating: 4.8,
		deliveryTime: '20-25 min',
		image: '/images/restaurants/cafe.jpg'
	}
]

// Steps
const steps = [
	{
		title: 'Explora',
		description: 'Busca entre los mejores restaurantes de Jiménez',
		icon: Search
	},
	{
		title: 'Ordena',
		description: 'Personaliza tu pedido y añade al carrito',
		icon: Smartphone
	},
	{
		title: 'Paga',
		description: 'Pago seguro en línea o al recibir',
		icon: CreditCard
	},
	{
		title: 'Disfruta',
		description: 'Recibe y disfruta tu comida caliente',
		icon: CheckCircle
	}
]

// Testimonials
const testimonials = [
	{
		name: 'María González',
		text: '¡Los mejores tacos al pastor de Jiménez! La entrega siempre es puntual y la comida llega caliente.',
		rating: 5,
		avatar: 'MG'
	},
	{
		name: 'Carlos Rodríguez',
		text: 'Me encanta poder pedir desde casa. El seguimiento en tiempo real es genial.',
		rating: 5,
		avatar: 'CR'
	},
	{
		name: 'Ana Martínez',
		text: 'Excelente servicio y variedad de restaurantes. ¡100% recomendado!',
		rating: 4,
		avatar: 'AM'
	}
]

</script>

<style scoped>
@keyframes spin-slow {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

@keyframes pulse-slow {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

@keyframes bounce {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-20px); }
}

@keyframes ping-slow {
	0% { transform: scale(1); opacity: 1; }
	100% { transform: scale(2); opacity: 0; }
}

.animate-spin-slow {
	animation: spin-slow 20s linear infinite;
}

.animate-pulse-slow {
	animation: pulse-slow 2s ease-in-out infinite;
}

.animate-bounce {
	animation: bounce 2s ease-in-out infinite;
}

.animate-ping-slow {
	animation: ping-slow 3s ease-out infinite;
}

.animate-slide-in {
	animation: slide-in 0.3s ease-out;
}

@keyframes slide-in {
	from {
		transform: translateY(-10px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}
</style>