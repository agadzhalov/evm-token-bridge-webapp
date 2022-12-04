import { useEffect, useState } from "react";
import { Card } from 'primereact/card';

type ErrorProps = {
  error: any;
};

const Error = ({ error }: ErrorProps) => {
    let formatedError = '';
    let parsedError = error !== undefined ? JSON.parse(error) : null;
    if (parsedError) {
      console.log(error)
        if (parsedError.data) {
          formatedError = parsedError.data.message;
        } else if (parsedError.message) {
          formatedError = parsedError.message;
        } else if (parsedError.error) {
          formatedError = parsedError.error.message ? parsedError.error.message : 'unknown';
        } else {
          formatedError = JSON.stringify(error);
        }
    }

  return (
    formatedError && (
    <div>
        <Card style={{ background: "#a94545", color: "#fff", fontWeight: "bold",  marginBottom: "1em" }}>
            { formatedError }
        </Card>
    </div>
  ));
};

export default Error;
