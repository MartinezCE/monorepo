const noop = () => null;

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: '/pass/plans/new/monthly',
    },
  };
}

export default noop;
