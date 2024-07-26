import React, { useEffect, useState } from 'react';
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CSpinner,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons';
import api from '../../api/api';

const WidgetsDropdown = () => {
  const [cardsData, setCardsData] = useState(null);

  useEffect(() => {
    api
      .get(`${process.env.REACT_APP_API_URL}/admin/dashboard`)
      .then((response) => {
        setCardsData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <CRow>
      {cardsData ? (
        <>
          {cardsData.data.map((cardData) => (
            <CCol sm={6} lg={3} key={Math.random()}>
              <CWidgetStatsA
                className='mb-4'
                color={cardData.color}
                value={
                  <>
                    {cardData.total + ' '}
                    <span className='fs-6 fw-normal'>
                      ( {cardData.percentVariation}%{' '}
                      <CIcon
                        icon={
                          cardData.typeArrow == 'up'
                            ? cilArrowTop
                            : cilArrowBottom
                        }
                      />
                      )
                    </span>
                  </>
                }
                title={cardData.title}
                action={
                  <CDropdown alignment='end'>
                    <CDropdownToggle
                      color='transparent'
                      caret={false}
                      className='p-0'
                    >
                      <CIcon
                        icon={cilOptions}
                        className='text-high-emphasis-inverse'
                      />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {cardData.actions.map((action) => (
                        <CDropdownItem href={action.href}>
                          {action.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartLine
                    className='mt-3 mx-3'
                    style={{ height: '70px' }}
                    data={cardData}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: cardData.min,
                          max: cardData.max,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                          tension: 0.4,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          ))}
        </>
      ) : (
        <>
          <CSpinner color='primary' />
        </>
      )}
    </CRow>
  );
};

export default WidgetsDropdown;
