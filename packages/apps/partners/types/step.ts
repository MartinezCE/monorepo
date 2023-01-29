export default interface Step {
  id: number;
  label: string;
  title?: string;
  secondaryText?: string;
  component?: React.ReactNode;
  sidebarChildren?: React.ReactNode;
}
