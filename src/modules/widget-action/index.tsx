const WIDGET_ACTIONS = ['swap', 'float', 'withdraw'] as const;
export type WidgetAction = typeof WIDGET_ACTIONS[number];

export type WidgetActionProp = { action: WidgetAction };
