export const formatSlotName = (slotName: string) => {
  return slotName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
