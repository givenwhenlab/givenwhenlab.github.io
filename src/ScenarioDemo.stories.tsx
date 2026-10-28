import type { Meta, StoryObj } from '@storybook/react'
import { ScenarioDemo } from './App'

const meta = {
  title: 'Hero/ScenarioDemo',
  component: ScenarioDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    language: {
      control: 'inline-radio',
      options: ['en', 'pt'],
    },
  },
} satisfies Meta<typeof ScenarioDemo>

export default meta
type Story = StoryObj<typeof meta>

export const English: Story = {
  args: { language: 'en' },
}

export const Portuguese: Story = {
  args: { language: 'pt' },
}
