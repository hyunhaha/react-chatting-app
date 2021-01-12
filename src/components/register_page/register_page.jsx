import React from "react";

const RegisterPage = props => {
  return (
    <form>
      <label>Example</label>
      <input name="example" defaultValue="test" />
      <label>ExampleRequired</label>
      <input
        name="exampleRequired"
        // ref={register({ required: true, maxLength: 10 })}
      />
      {/* {errors.exampleRequired && <p>This field is required</p>} */}
      <input type="submit" />
    </form>
  );
};

export default RegisterPage;
