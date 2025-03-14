export const toDateCall = (date: Date) => {
  return new Date(date).toISOString();
};

export const fromDateString = (date: string) => {
  return new Date(date);
};
