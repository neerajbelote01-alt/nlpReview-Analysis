from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, Token, UserOut
from app.core.security import hash_password, verify_password, create_access_token

class AuthService:
    @staticmethod
    def register_user(db: Session, data: UserRegister) -> Token:
        # Check duplicate email
        normalized_email = data.email.lower().strip()
        existing = db.query(User).filter(User.email == normalized_email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )
        
        pwd_hash = hash_password(data.password)
        user = User(
            full_name=data.full_name.strip(),
            email=normalized_email,
            password_hash=pwd_hash
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token_str = create_access_token(user.id)
        return Token(
            access_token=token_str,
            token_type="bearer",
            user=UserOut.model_validate(user)
        )

    @staticmethod
    def authenticate_user(db: Session, data: UserLogin) -> Token:
        normalized_email = data.email.lower().strip()
        user = db.query(User).filter(User.email == normalized_email).first()
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password combination."
            )
        
        token_str = create_access_token(user.id)
        return Token(
            access_token=token_str,
            token_type="bearer",
            user=UserOut.model_validate(user)
        )

auth_service = AuthService()
