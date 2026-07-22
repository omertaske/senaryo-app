import { useProjectStore } from '../../../store/useProjectStore';
import SynopsisView from './SynopsisView';

export default function Synopsis() {
  const { activeProject, updateActiveProject } = useProjectStore();

  const handleUpdate = (newText) => {
    updateActiveProject({ synopsis: newText });
  };

  return (
    <SynopsisView 
      text={activeProject?.synopsis || ""} 
      handleUpdate={handleUpdate} 
    />
  );
}