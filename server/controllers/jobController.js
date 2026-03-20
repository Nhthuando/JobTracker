import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllJobs = async (req , res) => {
    try{
        const userId = req.userId;
        if(!userId) return res.status(401).json({message: "Token không hợp lệ!"});
        const status = req.query.status ? req.query.status.toUpperCase() : undefined;
        const priority = req.query.priority ? req.query.priority.toUpperCase() : undefined;
        const validStatuses = ['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'GHOSTED'];
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
        if(status && !validStatuses.includes(status) ) return res.status(400).json({message: "Status không hợp lệ!"});
        if(priority && !validPriorities.includes(priority)) return res.status(400).json({message: "Priority không hợp lệ!"});
        const where = {user_id: userId,...(status && { status }),...(priority && { priority })};
        const jobs = await prisma.jobs.findMany({where,orderBy: { created_at: 'desc' }});
        if (jobs.length === 0) return res.status(200).json({ jobs });
        return res.status(200).json({ jobs });
    }catch(err){
        console.log(err);
        return res.status(500).json({message : "Có lỗi server!"});
    }
}

export const getJob = async  (req,res) =>  {
    try{
        const userId = req.userId;
        if(!userId) return res.status(401).json({message: "Token không hợp lệ!"});
        const jobId = parseInt(req.params.id);
        if(isNaN(jobId)) return res.status(400).json({message: "Job ID không hợp lệ!"});
        const job = await prisma.jobs.findFirst({where: {user_id: userId, id: jobId}});
        if(!job) return res.status(404).json({message: "Không tìm thấy job!"});
        return res.status(200).json({job});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Có lỗi server!"});
    }
}

export const createJob = async (req,res) => {
    try{
        const userId = req.userId;
        if(!userId) return res.status(401).json({message: "Token không hợp lệ!"});
        const {company, position, status, priority, source, appliedDate, interviewDate,notes,salary,location, jobUrl,contactName,contactEmail } = req.body;
        if(!company || !position ) return res.status(400).json({message: "Các trường bắt buộc đang trống!"});
        const validStatuses = ['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'GHOSTED'];
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
        if(status && !validStatuses.includes(status.toUpperCase())) return res.status(400).json({message: "Status không hợp lệ!"});
        if(priority && !validPriorities.includes(priority.toUpperCase())) return res.status(400).json({message: "Priority không hợp lệ"});
        const job = await prisma.jobs.create({data: {user_id: userId, company: company, position: position, status: status.toUpperCase(), priority:priority.toUpperCase(), source: source, applied_date: appliedDate ? new Date(appliedDate).toISOString() : null,
                interview_date: interviewDate ? new Date(interviewDate).toISOString() : null, notes: notes, salary: salary,location: location, job_url: jobUrl, contact_name: contactName, contact_email : contactEmail}});
        return res.status(201).json({job});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Có lỗi server!"});
    }
}

export const updateJob = async (req,res) => {
    try{
        const userId = req.userId;
        if(!userId) return res.status(401).json({message: "Token không hợp lệ!"});
        const jobId = parseInt(req.params.id);
        if(isNaN(jobId)) return res.status(400).json({message: "Job ID không hợp lệ!"});
        const job = await prisma.jobs.findFirst({where: {user_id: userId, id: jobId}});
        if(!job) return res.status(404).json({message: "không tìm thấy Job!"});
        const {company, position, status, priority, source, appliedDate, interviewDate,notes,salary,location, jobUrl,contactName,contactEmail} = req.body;
        const validStatuses = ['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'GHOSTED'];
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
        if(status && !validStatuses.includes(status.toUpperCase())) return res.status(400).json({message: "Status không hợp lệ!"});
        if(priority && !validPriorities.includes(priority.toUpperCase())) return res.status(400).json({message: "Priority không hợp lệ"});
        const updData = {};
        const hasField = (field) => Object.prototype.hasOwnProperty.call(req.body, field);

        if (hasField('company')) {
            if (!company || !company.trim()) return res.status(400).json({message: "Company không được để trống!"});
            updData.company = company.trim();
        }
        if (hasField('position')) {
            if (!position || !position.trim()) return res.status(400).json({message: "Position không được để trống!"});
            updData.position = position.trim();
        }
        if (hasField('status')) {
            if (!status || !status.trim()) return res.status(400).json({message: "Status không hợp lệ!"});
            updData.status = status.toUpperCase();
        }
        if (hasField('priority')) {
            if (!priority || !priority.trim()) return res.status(400).json({message: "Priority không hợp lệ"});
            updData.priority = priority.toUpperCase();
        }
        if (hasField('source')) updData.source = source && source.trim() ? source.trim() : null;
        if (hasField('notes')) updData.notes = notes && notes.trim() ? notes.trim() : null;
        if (hasField('salary')) updData.salary = salary && salary.trim() ? salary.trim() : null;
        if (hasField('location')) updData.location = location && location.trim() ? location.trim() : null;
        if (hasField('jobUrl')) updData.job_url = jobUrl && jobUrl.trim() ? jobUrl.trim() : null;
        if (hasField('contactName')) updData.contact_name = contactName && contactName.trim() ? contactName.trim() : null;
        if (hasField('contactEmail')) updData.contact_email = contactEmail && contactEmail.trim() ? contactEmail.trim() : null;

        if (hasField('appliedDate')) {
            if (appliedDate === null || appliedDate === '') {
                updData.applied_date = null;
            } else {
                const date = new Date(appliedDate);
                if (isNaN(date.getTime())) return res.status(400).json({message: "Applied date không hợp lệ!"});
                updData.applied_date = date.toISOString();
            }
        }

        if (hasField('interviewDate')) {
            if (interviewDate === null || interviewDate === '') {
                updData.interview_date = null;
            } else {
                const date = new Date(interviewDate);
                if (isNaN(date.getTime())) return res.status(400).json({message: "Interview date không hợp lệ!"});
                updData.interview_date = date.toISOString();
            }
        }
        if(Object.keys(updData).length === 0 && updData.constructor === Object ) return res.status(400).json({message: "Không có dữ liệu để cập nhật!"});
        const updJob = await prisma.jobs.update({where: {id: jobId}, data: updData});
        return res.status(200).json({updJob});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Có lỗi server!"});
    }

}

export const deleteJob = async(req,res) =>{
    try{    
        const userId = req.userId;
        if(!userId) return res.status(401).json({message: "Token không hợp lệ!"});
        const jobId = parseInt(req.params.id);
        if(isNaN(jobId)) return res.status(400).json({message: "Job ID không hợp lệ!"});
        const job = await prisma.jobs.findFirst({where: {id: jobId, user_id: userId}});
        if(!job) return res.status(404).json({message: "Không tìm thấy job!"});
        await prisma.jobs.delete({where: {id: jobId}});
        return res.status(200).json({message: "Đã xóa thành công!"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Có lỗi server!"});
    }
}

export const getJobStats = async(req,res) =>{
    try{
        const userId = req.userId;
        if(!userId) return res.status(401).json({message: "Token không hợp lệ!"});
        const statuses = ['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'GHOSTED'];
        const stats = {};
        for (const status of statuses) {
            const count = await prisma.jobs.count({where: {user_id: userId, status}});
            stats[status] = count;
            }
        return res.status(200).json({stats});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Có lỗi server!"});
    }
}