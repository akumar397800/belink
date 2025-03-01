const forgotPasswordTemplate = ({ name, otp }) => {
    return `
    <div>
        <p>Dear, ${name}</p>
        <p>You're are requested to use the following otp to reset the password</p>
        <div style ="background:yellow">
        ${otp}</div>
        <br />
        <p>This is valid for only one hour.</p>
        <p>Thak you </p>
    </div>
    `
}

export default forgotPasswordTemplate