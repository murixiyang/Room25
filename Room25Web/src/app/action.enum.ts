export enum Action {
  MOVE = 'Move',
  PEEK = 'Peek',
  PUSH = 'Push',
  DRAG = 'Drag',
  SPECIAL = 'Special',
  NONE = 'None',
}

export const ActionClassMap: { [key in Action]: string } = {
  [Action.MOVE]: 'action-move',
  [Action.PEEK]: 'action-peek',
  [Action.PUSH]: 'action-push',
  [Action.DRAG]: 'action-drag',
  [Action.SPECIAL]: 'action-special',
  [Action.NONE]: 'action-none',
};
