import React, { useEffect, useState } from 'react'
import "../assets/css/project.css"
import { Button, InputAdornment, TextField } from '@mui/material';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import PageTransition from './PageTransition';
import FilesListItem from './FilesListItem';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import { useSelectFilesMutation, useUploadFileMutation } from '../features/files/filesApiSlice';
import { selectCurrentSelectedFiles, toggleShow } from '../features/files/filesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useDeleteProjectMutation, useFetchProjectByIdQuery } from '../features/projects/ProjectApiSlice';
import FileUploader from './FileUploader';

const Project = () => {
    const [files, setFiles] = useState(null);
    const [type, setType] = useState("guidelines");
    const project_id = useParams().projectId;
    const navigate = useNavigate();
    const [selectFiles] = useSelectFilesMutation();
    const [uploadFile] = useUploadFileMutation();
    const [deleteProject] = useDeleteProjectMutation();
    const selectedFiles = useSelector(selectCurrentSelectedFiles);
    const { data: project, isLoading } = useFetchProjectByIdQuery(project_id)
    const dispatch = useDispatch();
    const startChatting = async (e) => {
        e.preventDefault();
        try {
            await selectFiles({ fileNames: selectedFiles, project_id })
            navigate(`/chatbot/${project_id}`)
        } catch (error) {
            console.log(error)

        }
    }
    const uploadFiles = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        try {
            formData.append('uploaded_file', files);
            formData.append('project_id', project_id);
            formData.append('type', type);
            uploadFile(formData);
            setFiles(null)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        dispatch(toggleShow(true));
    }, [files, dispatch]);
    const deleteHandler = async() => {
        try {
            await deleteProject(project_id);
            navigate('/projects')
        } catch (error) {
            console.log(error);
        }
    }
    let content;
    if (isLoading) {
        content = (
            <div>Loading...</div>
        )
    } else {
        content = (
            <div className='project-item-container' style={{ position: "relative" }}>
                <div className="pci-left">
                    <div className="pci-left-header">
                        <div className="pci-lh-left" ><span style={{ cursor: "pointer" }} onClick={() => navigate("/projects")}>My Projects</span>/{project?.project_name}</div>
                        <div className="pci-lh-right">
                            <TextField
                                className='pci-lh-right-input'
                                variant="outlined"
                                placeholder='Search'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlinedIcon />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button variant="outlined" className='pci-lh-right-button' onClick={deleteHandler}>
                                <DeleteForeverOutlinedIcon className='pci-lh-rb-icon' />
                            </Button>
                            <Button variant="outlined" className='pci-lh-right-button' onClick={() => navigate("edit")}>
                                <BorderColorOutlinedIcon className='pci-lh-rb-icon' />
                            </Button>
                        </div>
                    </div>
                    <div className="pci-left-content">
                        <h3 className="pci-lc-title">Description:</h3>
                        <p className="pci-lc-desc full">{project.description || "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas dolores voluptate reiciendis dignissimos, expedita earum nesciunt voluptatum omnis ut quod."}</p>
                        <h3 className="pci-lc-title">Werkinhoud:</h3>
                        <p className="pci-lc-desc full">{project.werkinhood || "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas dolores voluptate reiciendis dignissimos, expedita earum nesciunt voluptatum omnis ut quod."}</p>
                        <div className="pci-lc-row">
                            <div className="pci-lc-col">
                                <h3 className="pci-lc-title">Contract type:</h3>
                                <p className="pci-lc-desc">{project.contract_type || "NAN"}</p>
                            </div>
                            <div className="pci-lc-col">
                                <h3 className="pci-lc-title">Client:</h3>
                                <p className="pci-lc-desc">{project.client || "NAN"}</p>
                            </div>
                        </div>
                        <div className="pci-lc-row">
                            <div className="pci-lc-col">
                                <h3 className="pci-lc-title">Status:</h3>
                                <p className="pci-lc-desc">{project.status || "In progress"}</p>
                            </div>
                            <div className="pci-lc-col">
                                <h3 className="pci-lc-title">Category:</h3>
                                <p className="pci-lc-desc">{project.category || "NAN"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pci-right">
                    <div className="pci-right-header">
                        <p>Files</p>
                        <div className='pci-rh-total'>{project?.files?.length}</div>
                    </div>
                    <ul className="pci-right-history">
                        {
                            project?.files?.map((f, index) => {
                                return (
                                    <FilesListItem key={index} item={f} />
                                )
                            })
                        }
                    </ul>
                    <div className="pci-right-footer">
                        <FileUploader type={type} setType={setType} setFile={setFiles} multi={false} />
                        {
                            files ?
                                <button className='cc-rf-button' onClick={uploadFiles}>
                                    <CloudUploadOutlinedIcon />
                                    Upload File
                                </button>
                                :
                                null
                        }
                        <button className='cc-rf-button' onClick={startChatting}>
                            <MarkChatReadIcon />
                            Start Chatting
                        </button>
                    </div>
                </div>
                <PageTransition />
            </div>
        )
    }
    return content
}

export default Project