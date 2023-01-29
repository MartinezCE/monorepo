import dynamic from 'next/dynamic';
import ReservesPageHeader from './ReservesPageHeader';
import ReservesForm from './ReservesForm';
import LocationImageSlideshow from './LocationImageSlideshow';

const BlueprintArea = dynamic(() => import('./BlueprintArea'), {
  ssr: false,
});
export { ReservesPageHeader, ReservesForm, BlueprintArea, LocationImageSlideshow };
