export const buildShortAddress = ({
  address,
  width = 5,
}: {
  address: string;
  width?: number;
}): string => {
  return address ? `${address.slice(0, width)}…${address.slice(-width)}` : '';
};
