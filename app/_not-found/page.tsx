import Image from 'next/image';
import React from 'react';
import logo from '../../assets/logo.png'

const NotFoundPage: React.FC = () => (
	<div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
		<Image src={logo} alt="Cxperia Logo" className="w-64 mb-8" />
		<h1 className="text-3xl font-bold mb-4 text-gray-800">404 - Page Not Found</h1>
	</div>
);

export default NotFoundPage;
