/* eslint-disable react/no-array-index-key */
import { useMemo, useState } from 'react';
import { Button, InputNumber, Modal, SquarePill, InfoBanner } from '@wimet/apps-shared';
import { Form, FormikProvider, useFormik } from 'formik';
import Image from 'next/image';
import blueGrid from '../../../../public/images/blue-grid.png';
import useCreateCompanyTeamCredits from '../../../../hooks/api/useCreateCompanyTeamCredits';
import * as S from './BuyCreditsModal.styles';
import useGetCompanyTeam from '../../../../hooks/api/useGetCompanyTeam';

enum PaymentMethods {
  TRANSFER = 'transfer',
  CARD = 'card',
}

const PAYMENT_TABLE_HEADERS = ['Créditos', 'Valor', 'Total'];

const BuyCreditsModal = ({ onClose, teamId }: { onClose: () => void; teamId: string }) => {
  const { mutateAsync: createTeamCredits, isLoading } = useCreateCompanyTeamCredits(teamId);
  const { data: team = {} } = useGetCompanyTeam(teamId);

  const [paymentType, setPaymentType] = useState<PaymentMethods>(PaymentMethods.CARD);

  const formik = useFormik({
    initialValues: {
      credits: null,
    },
    onSubmit: async values => {
      await createTeamCredits({ credits: Number(values.credits), paymentType });
      onClose();
    },
  });

  const currencyType = useMemo(() => team?.country?.currency?.currencyValue, [team]);

  // @TODO -> asegurarse que todos los paises tegan asociada una moneda en la tabla
  const creditUnitValue = useMemo(() => Number(team?.country?.currency?.credit?.value) || 50, [team]);

  const showPaymentResume = useMemo(() => !!formik.values.credits && paymentType, [formik, paymentType]);

  const paymentTableData = useMemo(() => {
    const { credits } = formik.values;
    return [credits, `$ ${creditUnitValue}`, `$ ${Number(credits) * creditUnitValue} ${currencyType}`];
  }, [creditUnitValue, currencyType, formik.values]);

  return (
    <Modal variant='light' onClose={onClose}>
      <FormikProvider value={formik}>
        <Form>
          <S.ModalWrapper>
            <div className='modal-credits__header'>
              <SquarePill>
                <Image src={blueGrid} />
              </SquarePill>
              <p className='modal-credits__header__title'>Compra de créditos</p>
            </div>

            <InfoBanner info='Con estos créditos los colaboradores podrán reservar el tipo de espacio que tú decidas. También podrás establecer un límite de presupuesto máximo por reserva / colaborador.' />
            <InputNumber
              className='modal-credits__input'
              label='Créditos'
              type='number'
              placeholder='Ingresa la cantidad de créditos que necesites'
              name='credits'
            />

            <div className='payment-method'>
              <p className='modal-credits__subtitle'>Método de pago</p>
              <S.TogglePayment>
                <S.ToggleItem
                  onClick={() => setPaymentType(PaymentMethods.TRANSFER)}
                  $selected={paymentType === PaymentMethods.TRANSFER}>
                  Transferencia
                </S.ToggleItem>
                <S.ToggleItem
                  onClick={() => setPaymentType(PaymentMethods.CARD)}
                  $selected={paymentType === PaymentMethods.CARD}>
                  Pago con tarjeta
                </S.ToggleItem>
              </S.TogglePayment>
            </div>

            <div className={`payments-resume-table ${showPaymentResume && 'show'}`}>
              <S.BuyCreditsResumeTable>
                <thead>
                  <tr>
                    {PAYMENT_TABLE_HEADERS.map(h => (
                      <td key={h} title={h}>
                        {h}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[{ items: paymentTableData }].map(({ items }, i) => (
                    <tr key={i}>
                      {items.map(item => (
                        <td key={item}>{item}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </S.BuyCreditsResumeTable>
              <S.BuyCreditsResumeTableFooter>
                <p>Total</p>
                <p>{`$ ${Number(formik.values.credits) * creditUnitValue} ${currencyType}`}</p>
              </S.BuyCreditsResumeTableFooter>
            </div>

            <div className='modal-credits__actions'>
              <Button variant='outline' onClick={onClose}>
                Cancelar
              </Button>
              <Button variant='primary' type='submit' disabled={!formik.values.credits || !paymentType || isLoading}>
                Confirmar
              </Button>
            </div>
          </S.ModalWrapper>
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default BuyCreditsModal;
