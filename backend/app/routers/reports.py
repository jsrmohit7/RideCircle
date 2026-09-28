from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.routers.deps import get_db, get_current_user
from app.schemas.schemas import ReportCreate, ReportResponse
from app.models.models import User, Report

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("", response_model=ReportResponse)
def create_report(report_in: ReportCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if report_in.reported_user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot report yourself")
        
    report = Report(
        reporter_id=current_user.id,
        **report_in.model_dump()
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
