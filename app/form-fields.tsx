export function FormSettings({ subject }: { subject: string }) {
  return <>
    <input type="hidden" name="_subject" value={subject} />
    <input type="hidden" name="_template" value="table" />
    <input className="form-honeypot" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
  </>;
}

export function CustomerFields() {
  return <>
    <label>Your name<input name="name" autoComplete="name" required maxLength={100} pattern=".*\S.*" placeholder="Full name" /></label>
    <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
    <label>Mobile number<input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} placeholder="Include country code" /></label>
  </>;
}
