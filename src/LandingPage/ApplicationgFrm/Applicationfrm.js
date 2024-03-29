import React, { useContext } from 'react'
import Firststep from './Firststep'
import Perso from './persona'
import Econ from './economic'
import Done from './done'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import PropTypes from 'prop-types';
import '../css/ApplicationFrm.css'
import { multiStepContext } from './StepContext';
import LanguageSwitcher from '../../LanguageSwitcher';
import { styled } from '@mui/material/styles';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';


  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor:'blue'
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor:'blue'
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 10,
      border: 0,
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1,
    },
  }));
  
  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[1000] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius:'5px',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
    ...(ownerState.active && {
      backgroundColor:'rgba(0, 32, 203, 1)',
      transform:'scale(1.5)'
    }),
    ...(ownerState.completed && {
      backgroundColor:'rgb(11, 73, 128)',
    }),
  }));
  
  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
  
    const icons = {
      1: <AccountBoxIcon />,
      2: <FamilyRestroomIcon />,
      3: <InfoIcon />,
    };
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }
  
  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };

  const steps = ['Personal Information', 'Family Background', 'Other Information'];
  const CustomStepLabel = styled(StepLabel)(({ theme, active }) => ({
    '& .MuiStepLabel-label': {
      color: active ? 'whitesmoke' : 'white', 
      fontWeight: active ? '900' : '200',
      fontSize: active ? '18px' : '15px',
      marginTop:'20px'
    },
  }));


function Applicationfrm() {
    const { currentStep, finalData} = useContext(multiStepContext);
    const { t } = useTranslation();
    function showStep(step){
        switch(step){  
            case 1 :
                return <Firststep/>
            case 2 :
                return <Perso/>
            case 3 :
                return <Econ/>
            case 4 : 
                return <Done/>
        }
    }
  return (
    <div className='w-screen flex flex-col'>
    <div className='w-full h-max mb-20 flex flex-col justify-center items-center'>
      <h1 className='bg-[#043F97] md:bg-transparent w-full text-white md:text-black pl-4 py-4 text-lg font-bold'>SCHOLARSHIP APPLICATION FORM</h1>
    <div className='flex items-center justify-center w-full md:w-4/5 text-blue-700 h-max py-2 bg-teal-500 md:rounded-tl-2xl md:rounded-tr-2xl'>
        <Stepper alternativeLabel style={{width:'100%',paddingTop:'20px',height:'max-Content',color:'white'}} activeStep={currentStep - 1} orientation='horizontal' connector={<ColorlibConnector />}>
        {steps.map((label,index) => (
          <Step key={label}>
            <CustomStepLabel  sx={{color:"white"}} active={currentStep === (index + 1)} StepIconComponent={ColorlibStepIcon}>{label}</CustomStepLabel>
          </Step>
        ))}
        </Stepper> 
    </div>
    <div className="relative sm:w-full md:w-4/5 bg-white">
      <div className=' bg-[#043F97] w-full flex justify-between items-center h-16 md:h-auto'>
        <div className=''>
        {currentStep === 1 && (<h2 className="hidden md:flex bg-[#043F97] w-full text-white pl-4 py-4 text-lg font-bold">{t("Personal Information")}</h2>)}
        {currentStep === 2 && (<h2 className="hidden md:flex bg-[#043F97] w-full text-white pl-4 py-4 text-lg font-bold">{t("Parent's Information")}</h2>)}
        {currentStep === 3 && (<h2 className="hidden md:flex bg-[#043F97] w-full text-white pl-4 py-4 text-lg font-bold">{t("Other Information")}</h2>)}
        {currentStep === 4 && (<h2 className="hidden md:flex bg-[#043F97] w-full text-white pl-4 py-4 text-lg font-bold"></h2>)}
        </div>
        <div className=''>
        <LanguageSwitcher />  
        </div>
      </div>
      <div className='sm:block md:flex py-4 px-2'>

        <div>
        {currentStep !== 3 && currentStep !== 4 && (<>
      <p style={{paddingLeft:'5px',fontStyle:'italic',color:'black',fontWeight:'300'}}>{t("Please use UPPERCASE FORMAT to fill up this application form")}.
      </p>
      <p style={{paddingLeft:'5px',fontStyle:'italic',color:'black',fontWeight:'300'}}>{t("Please fill in the required fields marked with * to complete the form")}</p>
      <p style={{paddingLeft:'5px',fontStyle:'italic',color:'black',fontWeight:'300'}}>{t("Review all fields in the online form carefully and provide complete and accurate information.")}</p>
      </>)}
      {currentStep === 3 && <p style={{paddingLeft:'5px',fontStyle:'italic'}}>Please complete the form by selecting your answers from the available choices.</p>}
      {currentStep === 4 && null}
        </div>

      </div>
    </div>
    <div className='block w-full md:w-4/5 bg-white'>
    {showStep(currentStep)}
    </div>
    </div>
    </div>
  )
}

export default Applicationfrm