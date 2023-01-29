import { FormikProvider, useFormik } from 'formik';
import styled from 'styled-components';
import Link from '../../Link';
import Select from '../../Select';
import BaseFormHeader from '../BaseFormHeader';
import { images } from '../../../assets';
import { FilterOption } from '../../../types';

const StyledHeader = styled(BaseFormHeader)`
  margin-top: 60px;
  margin-bottom: 40px;
  align-items: baseline;
`;

type Props = {
  filterOptions: FilterOption[];
  buttonText: string;
  buttonHref: string;
  initialFilterValue: string;
  title?: string;
  hideFilter?: boolean;
  hideTitle?: boolean;
};

export default function SpacesListHeader({
  initialFilterValue,
  filterOptions,
  buttonText,
  buttonHref,
  title = 'Espacios',
  hideFilter,
  hideTitle,
}: Props) {
  const formik = useFormik({
    initialValues: { filterOption: initialFilterValue },
    onSubmit: () => {},
  });

  return (
    <StyledHeader primaryText={title} hideTitle={hideTitle}>
      {!hideFilter ? (
        <FormikProvider value={formik}>
          <Select
            prefix='Ver:'
            variant='secondary'
            options={filterOptions}
            instanceId='filterOption'
            name='filterOption'
          />
        </FormikProvider>
      ) : (
        <div />
      )}
      <Link trailingIcon={<images.TinyMore />} href={buttonHref}>
        {buttonText}
      </Link>
    </StyledHeader>
  );
}
