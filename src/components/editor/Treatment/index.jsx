import { useProjectStore } from '../../../store/useProjectStore';
import TreatmentView from './TreatmentView';

export default function Treatment() {
  const { activeProject, updateActiveProject } = useProjectStore();

  const handleUpdate = (newText) => {
    updateActiveProject({ treatment: newText });
  };

  return (
    <TreatmentView 
      text={activeProject?.treatment || ""} 
      handleUpdate={handleUpdate} 
    />
  );
}