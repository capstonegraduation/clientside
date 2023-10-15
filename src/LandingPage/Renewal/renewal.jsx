import React from 'react'
import { FetchingBmccSchocODE,ListofReq,FetchRenewal,FillRenewal,FillRenewal1 } from '../../Api/request'
import './renewal.css'
import { useState } from 'react'
import { useEffect } from 'react'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import swal from 'sweetalert';
import { Button } from '@mui/material'
import { Backdrop, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 50,
    color: '#fff',
  }));
  const messageStyle = {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f2f2f2',
    border: '1px solid #ddd',
    borderRadius: '5px',
    maxWidth: '400px',
    margin: '0 auto',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const paragraphStyle = {
    fontSize: '16px',
    marginBottom: '10px',
  };

const Renewal = () => {
    const [schoinf,setSchoinf] = useState([])
    const [renewal,setRenewal] = useState([])
    const [schoid,setSchoid] = useState('')
    const [reqlist,setReqlist] = useState([])
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [file,setFile] = useState([])
    const [phoneNum,setPhoneNum] = useState('')
    const [baranggay,setBaranggay] = useState('')
    const [school,setSchool] = useState('')
    const [yearLevel,setYearlevel] = useState('')
    const [gradeLevel,setGradelevel] = useState('')
    const [guardian,setGuardian] = useState('')
    const [disablebtn,setDisablebtn] = useState(false)
    const [disablebtn1,setDisablebtn1] = useState(true)

    useEffect(() => {
        async function fetchData() {
          setShowBackdrop(true);
          try {
            const re = await FetchRenewal.FETCH_RENEW();
            setRenewal(re.data.list[0]);
          } catch (error) {
            console.error('Error fetching renewal data:', error);
            // Handle the error, e.g., show an error message
          } finally {
            setShowBackdrop(false);
          }
        }
    
        fetchData();
      }, []);
    
    const Findscho = async() =>{
  
      if (!schoid || schoid === '') {
        swal({
          text: 'Please input your Scholar Code first',
          timer: 2000,
          buttons: false,
          icon: "error",
        });
        return false;
      }
        const scholarCode = `SC-${schoid}`;
        setShowBackdrop(true)
        await FetchingBmccSchocODE.FETCH_SCHOLARSCODE(scholarCode)
        .then(async(res) =>{
          
            if(res.data.success === 0){
                setShowBackdrop(false)
                swal('ERROR',res.data.message,'error')
                return
            }else{
                setSchoinf(res.data.inf)
                const Batch = res.data.inf[0].Batch;
                const Scholartype = res.data.inf[0].scholarshipApplied;
                const req = await ListofReq.FETCH_REQUIREMENTS()
              
                const renewalList = req.data.Requirements.results1?.filter((data) => 
                data.docsfor === 'Renewal' &&
                data.batch === Batch &&
                data.schoName === Scholartype
                )
                setReqlist(renewalList)
                setShowBackdrop(false)
                setDisablebtn(true)
                setDisablebtn1(false)
            }
        })
    }
    const handleFileChange = (index,data, event) => {
        const files = [...file];
        const req = event.target.files[0]
        files[index] = {file:req,reqName:data.requirementName};
    
        setFile(files);
        
      };
      const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            if (!file || reqlist.length !== file.length) {
              swal({
                text: 'Please upload all Pictures.',
                timer: 2000,
                buttons: false,
                icon: "error",
              });
              return false;
            }
            const hasEmptyOrUndefined = file.some((list) => {
           
              return !list.file || !list.reqName || !list;
            });
            
            if (hasEmptyOrUndefined) {
              swal({
                text: 'Please provide both a file and a request name for each entry.',
                timer: 2000,
                buttons: false,
                icon: "error",
              });
              return;
            }
            const isValid = file.every((list) => {
             
              if(!list){
                swal({
                  text: 'Please upload all Pictures.',
                  timer: 2000,
                  buttons: false,
                  icon: "error",
                });
                return false;
              }
              if (list.file instanceof File) {
                const allowedExtensions = ['jpg', 'jpeg', 'png'];
                const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
                const fileExtension = list.file.name.split('.').pop().toLowerCase();
                
                if (!allowedExtensions.includes(fileExtension)) {
                  swal({
                    text: 'Please upload a PNG or JPG image for all Pictures.',
                    timer: 2000,
                    buttons: false,
                    icon: "error",
                  });
                  return false;
                }
            
                if (list.file.size > maxFileSize) {
                  swal({
                    text: 'Please make sure all files are less than 5MB in size.',
                    timer: 2000,
                    buttons: false,
                    icon: "error",
                  });
                  return false;
                }
            
                return true;
              }
              return true;
            });
            if(!isValid){
              return
            }
            const user = schoinf[0];
            const date = new Date();
            const formData = new FormData();
    
            formData.append('name', user.Name);
            formData.append('scholarCode', user.scholarCode);
            formData.append('schoApplied', user.scholarshipApplied);
            formData.append('yearLevel', yearLevel || user.yearLevel);
            formData.append('baranggay', baranggay || user.Baranggay);
            formData.append('batch', user.Batch);
            formData.append('email', user.email);
            formData.append('phoneNum', phoneNum || user.phoneNum);
            formData.append('remarks', user.remarks);
            formData.append('gradeLevel', gradeLevel || user.gradeLevel);
            formData.append('school', school || user.school);
            formData.append('guardian', guardian || user.guardian);
            formData.append('deadline', renewal.deadline);
            formData.append('updated', date);
            formData.append('year', renewal.year);
            formData.append('tableName', renewal.reqtable);
            formData.append('renewTitle', renewal.renewTitle);
    
            setShowBackdrop(true);
    
            const res = await FillRenewal.SET_RENEW(formData);
    
            if (res.data.success === 0) {
                setShowBackdrop(false);
                swal(res.data.message);
                return;
            } else {
            
                try {
                    const errors = [];
                    let counter = 0;
              
                    for (let index = 0; index < file.length; index++) {
                        const filereq = file[index].file;
                        const det = file[index].reqName;
                        if (!file) {
                            continue;
                        }
                        const formData = createFormData(filereq, det);
                        setShowBackdrop(true);
    
                        try {
                             await uploadDocument(formData)
                             .then((res)=>{
                              counter += 1;
                              if(counter === file.length){
                                setSchoid('')
                                setFile([])
                                setSchoinf([])
                                setReqlist([])
                                setDisablebtn1(true)
                                setShowBackdrop(false)
                                swal({
                                  text: 'Successfully Submitted',
                                  timer: 2000,
                                  buttons: false,
                                  icon: "success",
                                });
                                return
                              }

                             })
                           
                        } catch (error) {
                            handleFailedUpload(index, error);
                        }
                    }
                } catch (error) {
                    console.log('An error occurred during file submission:', error);
                }
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };
    
      const createFormData = (filereq,det) => {
        const applicantNum = schoinf[0].scholarCode;
        const formData = new FormData();
        formData.append('picture', filereq);
        formData.append('reqName', det);
        formData.append('scholarCode', applicantNum);
        formData.append('Name', schoinf[0].Name);
        formData.append('tableName', renewal.reqtable);
        return formData;
      };
      
      const uploadDocument = async (formData) => {
        try {
          const res = await FillRenewal1.SET_RENEW1(formData);
          return res.data;
        } catch (error) {
          throw error;
        }
      };
      
      const handleFailedUpload = (index, error) => {
        setShowBackdrop(false)
        console.error(`File upload failed for index ${index}:`, error);
        // You can implement appropriate error handling here
      };
      const isRenewalForm = () =>{
        let details;
        if(renewal){
            const Deadline = new Date(renewal?.deadline);
            const today = new Date()
            if(Deadline < today){
                details = 1
            }else{
                details =2 
            }
        }else{
            details= 0
        }
        return details
      };
    const isOpen = isRenewalForm();
  return (
    <>
    <StyledBackdrop open={showBackdrop}>
    <CircularProgress color="inherit" />
    </StyledBackdrop>
    {isOpen === 2 && (<div className='renewalcontainer'>
        <div className='renewalform'>
            <h1>Scholarship Renewal Form</h1>
            <div className='searchid'>
                <div style={{display:'flex',flexDirection:'column'}}>
                <label htmlFor="">Scholarship Code:</label>
                <div style={{display:'flex'}}>
                <div className='schlabel'>SCH-</div>
                <input className='schid' type="text" 
                placeholder='Input your Scholarship Code'
                value={schoid}
                onChange={(e) =>setSchoid(e.target.value)}
                />
                </div>
                </div>
                <div className='schoidbtn'>
                <button disabled={disablebtn} style={{color:'white',textTransform:'none',width:'maxContent',height:'40px'}} className='myButton'
                onClick={Findscho}
                >
                    Submit
                </button>
                </div>

            </div>
            <div className="renewFormdet">
                {schoinf?.map((data) =>{
                    return (
                        <>
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Name</Form.Label>
                            <Form.Control
                            type="text" 
                            name='Name'
                            value={data.Name} 
                            disabled
                            />
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Gender</Form.Label>
                            <Form.Control 
                            type="text" 
                            disabled
                            name='Gender'
                            value={data.gender}
                            />
                            </Form.Group> 
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Scholarship Applied</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='Scholarship Applied'
                            value={data.scholarshipApplied} 
                            disabled
                            />
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Batch</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='Batch'
                            value={data.Batch} 
                            disabled
                            />
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Email</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='Email'
                            value={data.email} 
                            disabled
                            />
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Phone Number</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='Phone Number'
                            value={phoneNum} 
                            placeholder={data.phoneNum}
                            onChange={(e) =>setPhoneNum(e.target.value)}
                            />
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Baranggay</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='Baranggay'
                            value={baranggay}
                            placeholder={data.Baranggay} 
                            onChange={(e) => setBaranggay(e.target.value)}
                            />
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Current School</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='school'
                            value={school}
                            placeholder={data.school} 
                            onChange={(e) => setSchool(e.target.value)}
                            />
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Year Level</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='yearLevel'
                            value={yearLevel}
                            placeholder={data.yearLevel} 
                            onChange={(e) =>setYearlevel(e.target.value)}
                            />
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Grade/Year</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='gradeLevel'
                            value={gradeLevel} 
                            placeholder={data.gradeLevel}
                            onChange={(e) =>setGradelevel(e.target.value)}
                            />
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label className='frmlabel'>Guardian</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='guardian'
                            value={guardian} 
                            placeholder={data.guardian}
                            onChange={(e) =>setGuardian(e.target.value)}
                            />
                            </Form.Group>
                            <br/>
                            <Form.Label className='frmlabel'>List of Requirements</Form.Label>
                            {reqlist?.map((data,index) =>{
                                return(
                                    <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>{data.requirementName}</Form.Label>
                                    <Form.Control type="file" 
                                    onChange={(event) => handleFileChange(index,data, event)}
                                    />
                                    </Form.Group>
                                )
                            })}
                        </>
                    )
                })}
            </div>
            <div style={{margin:'15px'}}>
                <Button disabled={disablebtn1} sx={{color:'white',textTransform:'none'}} className='myButton' onClick={handleSubmit}>Submit Renewal</Button>
            </div>
        </div>
    </div>)}
    {isOpen === 1 && (<>
        <div style={messageStyle} className="renewal-ended-message">
      <h2 style={headingStyle}>Renewal Period Has Ended</h2>
      <p style={paragraphStyle}>The renewal period for this scholarship has ended.</p>
      <p style={paragraphStyle}>If you have any questions or need further assistance, please contact our support team.</p>
    </div>
    </>)}
    {isOpen === 0 && (<>
        <div style={messageStyle} className="no-renewal-message">
      <h2 style={headingStyle}>No Renewal For Now</h2>
      <p style={paragraphStyle}>There is currently no active renewal period for this scholarship.</p>
      <p style={paragraphStyle}>Please check back later for updates or contact our support team if you have any questions.</p>
    </div>
    </>)}
    </>
  )
}

export default Renewal