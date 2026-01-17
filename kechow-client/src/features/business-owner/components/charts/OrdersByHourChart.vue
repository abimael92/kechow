<template>
  <div class="orders-by-hour-chart">
    <div class="chart-header mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {{ t('ordersDistribution') }}
      </p>
    </div>

    <div class="chart-wrapper" ref="chartWrapper">
      <canvas ref="chartCanvas" :width="canvasWidth" :height="height"></canvas>
    </div>

    <div v-if="showLegend" class="chart-footer mt-4">
      <div class="flex flex-wrap gap-4 items-center justify-center">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('orders') }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('revenue') }}</span>
        </div>
        <div v-if="peakHour" class="flex items-center gap-2">
          <i class="ri-time-line text-amber-500"></i>
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ t('peakHour') }}: {{ peakHour }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'OrdersByHourChart',
  
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    height: {
      type: Number,
      default: 250
    },
    title: {
      type: String,
      default: 'Orders by Hour'
    },
    showLegend: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    const { t } = useI18n();
    
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    const chartWrapper = ref<HTMLElement | null>(null);
    const canvasWidth = ref(400);
    const peakHour = ref('');
    let chartInstance: any = null;

    // Compute peak hour
    const computePeakHour = () => {
      if (!props.data || props.data.length === 0) {
        peakHour.value = '';
        return;
      }

      let maxOrders = 0;
      let maxHour = '';
      
      props.data.forEach((item: any) => {
        if (item.orders > maxOrders) {
          maxOrders = item.orders;
          maxHour = item.hourLabel || `${item.hour}:00`;
        }
      });
      
      peakHour.value = maxHour;
    };

    // Format number
    const formatNumber = (num: number) => {
      if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
      return num.toString();
    };

    // Initialize chart
    const initChart = async () => {
      if (!chartCanvas.value || !props.data || props.data.length === 0) {
        return;
      }

      // Lazy load Chart.js
      let Chart: any;
      try {
        const ChartModule = await import('chart.js/auto');
        Chart = ChartModule.default;
      } catch (error) {
        console.error('Failed to load Chart.js:', error);
        return;
      }

      // Destroy existing chart
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Prepare data
      const labels = props.data.map((item: any) => item.hourLabel || `${item.hour}:00`);
      const ordersData = props.data.map((item: any) => item.orders);
      const revenueData = props.data.map((item: any) => item.revenue || 0);

      // Create gradient
      const ctx = chartCanvas.value.getContext('2d');
      let gradient: CanvasGradient | null = null;
      if (ctx) {
        gradient = ctx.createLinearGradient(0, 0, 0, props.height);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      }

      // Configure chart
      const config = {
        type: 'bar' as const,
        data: {
          labels,
          datasets: [
            {
              label: t('orders'),
              data: ordersData,
              backgroundColor: gradient || '#3b82f6',
              borderColor: '#1d4ed8',
              borderWidth: 1,
              borderRadius: 4,
              order: 2
            },
            {
              label: t('revenue'),
              data: revenueData,
              type: 'line' as const,
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.4,
              fill: false,
              pointBackgroundColor: '#10b981',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 4,
              order: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index' as const,
              intersect: false,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#1f2937',
              bodyColor: '#374151',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              callbacks: {
                label: (context: any) => {
                  const label = context.dataset.label;
                  const value = context.parsed.y;
                  if (label === t('revenue')) {
                    return `${label}: $${formatNumber(value)}`;
                  }
                  return `${label}: ${formatNumber(value)}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6b7280',
                maxRotation: 45
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                color: '#6b7280',
                callback: (value: number) => formatNumber(value)
              }
            }
          }
        }
      };

      // Adjust for dark mode
      if (document.documentElement.classList.contains('dark')) {
        config.options.plugins.tooltip.backgroundColor = 'rgba(31, 41, 55, 0.95)';
        config.options.plugins.tooltip.titleColor = '#f3f4f6';
        config.options.plugins.tooltip.bodyColor = '#d1d5db';
        config.options.plugins.tooltip.borderColor = '#4b5563';
        config.options.scales.x.ticks.color = '#9ca3af';
        config.options.scales.y.ticks.color = '#9ca3af';
        config.options.scales.y.grid.color = 'rgba(255, 255, 255, 0.05)';
      }

      chartInstance = new Chart(chartCanvas.value, config);
      computePeakHour();
    };

    // Handle resize
    const handleResize = () => {
      if (chartWrapper.value) {
        canvasWidth.value = chartWrapper.value.clientWidth;
        if (chartInstance) {
          chartInstance.resize();
        }
      }
    };

    // Lifecycle
    onMounted(() => {
      nextTick(() => {
        if (props.data && props.data.length > 0) {
          initChart();
        }
        handleResize();
      });

      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      window.removeEventListener('resize', handleResize);
    });

    // Watchers
    watch(() => props.data, () => {
      nextTick(() => {
        initChart();
      });
    }, { deep: true });

    return {
      chartCanvas,
      chartWrapper,
      canvasWidth,
      peakHour,
      t
    };
  }
});
</script>
