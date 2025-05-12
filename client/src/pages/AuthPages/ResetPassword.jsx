import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, message } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword !== confirm) return alert("Passwords don't match");

    const success = await resetPassword({ token, newPassword });
    if (success) navigate("/login");
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type={show ? "text" : "password"}
          placeholder="New Password"
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <input
          type={show ? "text" : "password"}
          placeholder="Confirm Password"
          onChange={e => setConfirm(e.target.value)}
          required
        />
        <button type="button" onClick={() => setShow(!show)}>
          {show ? "Hide" : "Show"} Password
        </button>
        <button type="submit">Reset</button>
      </form>
    </div>
  );
};

export default ResetPassword;
