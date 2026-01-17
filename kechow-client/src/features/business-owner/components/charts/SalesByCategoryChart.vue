<template>
  <div class="sales-by-category-chart">
    <div class="chart-header mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {{ t('salesDistribution') }}
      </p>
    </div>

    <div class="chart-wrapper" ref="chartWrapper">
      <canvas ref="chartCanvas" :width="canvasWidth" :height="height"></canvas>
    </div>

    <div v-if="showLegend" class="chart-footer mt-6">
      <div class="grid grid-cols-2 gap-3">
        <div 
          v-for="(item, index) in legendItems" 
          :key="index"
          class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
          @click="highlightCategory(item.category)"
          @mouseenter="hoverCategory(item.category)"
          @mouseleave="resetHighlight"
        >
          <div 
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: item.color }"
          ></div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ item.category }}
              </span>
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-2">
                {{ item.percentage }}%
              </span>
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                ${{ formatCurrency(item.sales) }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ item.orders }} {{ t('orders') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalSales > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('totalSales') }}</p>
          <p class="text-lg font-bold text-gray-900 dark:text-white">${{ formatCurrency(totalSales) }}</p>
        </div>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('topCategory') }}</p>
          <p class="text-lg font-bold text-gray-900 dark:text-white">{{ topCategory }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'SalesByCategoryChart',
  
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    height: {
      type: Number,
      default: 300
    },
    title: {
      type: String,
      default: 'Sales by Category'
    },
    showLegend: {
      type: Boolean,
      default: true
    },
    chartType: {
      type: String,
      default: 'doughnut' // 'pie', 'doughnut', 'bar'
    }
  },

  setup(props) {
    const { t } = useI18n();
    
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    const chartWrapper = ref<HTMLElement | null>(null);
    const canvasWidth = ref(400);
    let chartInstance: any = null;

    // Colors for categories
    const categoryColors = [
      '#3b82f6', // Blue
      '#10b981', // Green
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#8b5cf6', // Purple
      '#ec4899', // Pink
      '#06b6d4', // Cyan
      '#84cc16', // Lime
    ];

    // Computed properties
    const totalSales = computed(() => {
      if (!props.data || props.data.length === 0) return 0;
      return props.data.reduce((sum: number, item: any) => sum + (item.sales || 0), 0);
    });

    const topCategory = computed(() => {
      if (!props.data || props.data.length === 0) return '';
      const maxItem: any = props.data.reduce((max: any, item: any) => 
        (item.sales || 0) > (max.sales || 0) ? item : max
      );
      return maxItem.category || '';
    });

    const legendItems = computed(() => {
      if (!props.data || props.data.length === 0) return [];
      
      return props.data.map((item: any, index: number) => ({
        category: item.category || `Category ${index + 1}`,
        sales: item.sales || 0,
        orders: item.orders || 0,
        percentage: totalSales.value > 0 ? 
          Math.round(((item.sales || 0) / totalSales.value) * 100) : 0,
        color: categoryColors[index % categoryColors.length]
      }));
    });

    // Format currency
    const formatCurrency = (value: number) => {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toFixed(0);
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
      const labels = props.data.map((item: any) => item.category || 'Unknown');
      const salesData = props.data.map((item: any) => item.sales || 0);
      const backgroundColors = props.data.map((_: any, index: number) => 
        categoryColors[index % categoryColors.length]
      );

      // Configure chart based on type
      const chartConfig: any = {
        type: props.chartType,
        data: {
          labels,
          datasets: [{
            data: salesData,
            backgroundColor: backgroundColors,
            borderColor: props.chartType === 'bar' ? backgroundColors.map(color => color + 'CC') : '#ffffff',
            borderWidth: props.chartType === 'bar' ? 1 : 2,
            borderRadius: props.chartType === 'bar' ? 4 : 0,
            hoverOffset: props.chartType === 'bar' ? 0 : 15,
            hoverBackgroundColor: backgroundColors.map(color => color + 'CC')
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const percentage = totalSales.value > 0 ? 
                    Math.round((value / totalSales.value) * 100) : 0;
                  return `${label}: $${formatCurrency(value)} (${percentage}%)`;
                }
              },
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#1f2937',
              bodyColor: '#374151',
              borderColor: '#e5e7eb',
              borderWidth: 1
            }
          },
          cutout: props.chartType === 'doughnut' ? '60%' : 0,
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      };

      // Adjust for bar chart
      if (props.chartType === 'bar') {
        chartConfig.options.scales = {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#6b7280',
              callback: (value: number) => `$${formatCurrency(value)}`
            }
          }
        };
      }

      // Adjust for dark mode
      if (document.documentElement.classList.contains('dark')) {
        chartConfig.options.plugins.tooltip.backgroundColor = 'rgba(31, 41, 55, 0.95)';
        chartConfig.options.plugins.tooltip.titleColor = '#f3f4f6';
        chartConfig.options.plugins.tooltip.bodyColor = '#d1d5db';
        chartConfig.options.plugins.tooltip.borderColor = '#4b5563';
        
        if (props.chartType === 'bar') {
          chartConfig.options.scales.x.ticks.color = '#9ca3af';
          chartConfig.options.scales.y.ticks.color = '#9ca3af';
          chartConfig.options.scales.y.grid.color = 'rgba(255, 255, 255, 0.05)';
        }
      }

      chartInstance = new Chart(chartCanvas.value, chartConfig);
    };

    // Category interactions
    const highlightCategory = (category: string) => {
      if (!chartInstance) return;
      
      const index = legendItems.value.findIndex((item: any) => item.category === category);
      if (index !== -1) {
        // Toggle highlight
        const meta = chartInstance.getDatasetMeta(0);
        const isHidden = meta.data[index].hidden;
        meta.data[index].hidden = !isHidden;
        chartInstance.update();
      }
    };

    const hoverCategory = (category: string) => {
      if (!chartInstance || props.chartType === 'bar') return;
      
      const index = legendItems.value.findIndex((item: any) => item.category === category);
      if (index !== -1) {
        // Highlight on hover
        chartInstance.setActiveElements([{ datasetIndex: 0, index }]);
        chartInstance.update();
      }
    };

    const resetHighlight = () => {
      if (!chartInstance || props.chartType === 'bar') return;
      chartInstance.setActiveElements([]);
      chartInstance.update();
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

    watch(() => props.chartType, () => {
      nextTick(() => {
        initChart();
      });
    });

    return {
      chartCanvas,
      chartWrapper,
      canvasWidth,
      totalSales,
      topCategory,
      legendItems,
      formatCurrency,
      highlightCategory,
      hoverCategory,
      resetHighlight,
      t
    };
  }
});
</script>

