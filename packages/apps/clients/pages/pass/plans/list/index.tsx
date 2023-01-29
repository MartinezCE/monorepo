import Script from 'next/script';
import React from 'react';
import Layout from '../../../../components/Layout';

export type PlanVariation = {
  label?: string;
  value?: string;
  credits: string;
  monthValue?: string;
  creditValue?: string;
  visitRange?: string;
  title?: string;
  description?: string;
};

export type Plan = {
  name?: 'monthly' | 'pay-as-you-go';
  title?: string;
  percentage?: number;
  variations: PlanVariation[];
};

export type ListItem = {
  title: string;
  description: string;
  icon: JSX.Element;
};

export type List = {
  title?: string;
  items: ListItem[];
};

const PlanListPage = () => (
  <Layout>
    <div className='calculator' data-calc-id='fEohTdhGvbJBPZTPr' data-type='framed' />
    <Script src='https://scripts.convertcalculator.com/embed.js' async />
  </Layout>
);

export default PlanListPage;

// TODO: Use this when needed
// import { BaseHeaderTitle, images } from '@wimet/apps-shared';
// import { useRouter } from 'next/router';
// import styled from 'styled-components';
// import Layout from '../../../components/Layout';
// import CustomList from '../../../components/PlansPage/CustomList';
// import PlanCard from '../../../components/PlansPage/PlanCard';
// import { PlanListData } from '../../../mocks';

// const StyledWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   margin-left: 50px;
//   margin-top: 40px;
//   gap: 20px;

//   > div:last-child {
//     max-width: 350px;
//   }
// `;

// // const StyledTagWrapper = styled.div`
// //   display: flex;
// //   flex-direction: row;
// //   gap: 10px;
// //   margin: 30px 0;
// // `;

// const ListData: List = {
//   title: 'Sin limitaciones, sin compromisos, sin despilfarros',
//   items: [
//     {
//       title: 'Recarga cuando quieras',
//       description: 'ARS $300 por crédito',
//       icon: <images.Money />,
//     },
//     {
//       title: 'Abierto y transparente',
//       description: 'Sin cargos ocultos',
//       icon: <images.Eye />,
//     },
//     {
//       title: 'Sin compromisos',
//       description: 'Actualizar, bajar de categoría o cancelar en cualquier momento',
//       icon: <images.Unatached />,
//     },
//     {
//       title: 'Usuarios ilimitados',
//       description: 'Pague por espacios, no por personas',
//       icon: <images.Staff />,
//     },
//     {
//       title: 'No hay desperdicio',
//       description: 'Renueva los créditos no utilizados',
//       icon: <images.CicleArrows />,
//     },
//     {
//       title: 'Pago sencillo',
//       description: 'Una factura centralizada',
//       icon: <images.Plans />,
//     },
//   ],
// };

// export default function PlanListPage() {
//   const router = useRouter();
//   return (
//     <Layout>
//       <StyledWrapper>
//         <div>
//           <BaseHeaderTitle
//             primaryText='Conocé nuestros planes'
//             primaryIcon={<images.BiggerQuestion />}
//             description='Podrás asignarlos una vez que tus colaboradores se registren'
//           />
//           {/* <StyledTagWrapper>
//             <Tag onClick={() => {}}>Starter</Tag>
//             <Tag onClick={() => {}}>Team</Tag>
//             <Tag onClick={() => {}}>Enterprise</Tag>
//           </StyledTagWrapper> */}
//           {PlanListData.map(item => (
//             <PlanCard key={item.name} plan={item} onClick={() => router.push(`new/{item.name}`)} />
//           ))}
//         </div>
//         <div>
//           <CustomList list={ListData} />
//         </div>
//       </StyledWrapper>
//     </Layout>
//   );
// }
