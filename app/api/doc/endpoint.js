import React from 'react';

const Endpoint = ({ method, url, description, bodyParams, response }) => (
  <div className='bg-gray-100 p-6 rounded-lg mb-8'>
    <h3 className='text-xl font-mono mb-2'>{method} {url.split('/').pop().replace(/\b\w/g, l => l.toUpperCase())}</h3>
    <p className='font-mono mb-4'>
      <strong>Description:</strong> {description}
    </p>
    <p className='font-mono mb-2'>
      <strong>Method</strong> {method}
    </p>
    <p className='font-mono mb-2'>
      <strong>URL</strong>{' '}
      <a href={`http://localhost:3000${url}`} className='text-blue-500 hover:underline'>
        {url}
      </a>
    </p>
    {bodyParams && (
      <>
        <p className='font-mono mb-4'>
          <strong>Body Parameters:</strong>
        </p>
        <ul className='list-disc pl-5'>
          {bodyParams.map((param, index) => (
            <li className='mb-2' key={index}>
              <strong>{param.description}</strong>
              <pre className='bg-gray-200 p-4 rounded-lg font-mono'>
                <code>{param.example}</code>
              </pre>
            </li>
          ))}
        </ul>
      </>
    )}
    {response && (
      <>
        <p className='font-mono mt-4'>
          <strong>Response</strong>
        </p>
        <ul className='list-disc pl-5'>
          {response.map((res, index) => (
            <li className='mb-2' key={index}>
              <strong>{res.description}</strong>
              <pre className='bg-gray-200 p-4 rounded-lg font-mono'>
                <code>{res.example}</code>
              </pre>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);

export default Endpoint;
