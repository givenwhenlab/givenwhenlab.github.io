import type { Preview } from '@storybook/react'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
    backgrounds: {
      default: 'charcoal',
      values: [
        { name: 'charcoal', value: '#111412' },
        { name: 'paper', value: '#f4f6f1' },
      ],
    },
  },
}

export default preview
