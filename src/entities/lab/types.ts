export interface LabExperiment {
  id: string;
  title: string;
  status: 'alpha' | 'beta' | 'released';
  description: string;
  tags: string[];
}
