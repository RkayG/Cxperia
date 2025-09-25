'use client';
import React from 'react';
import ScrollStack, {  ScrollStackItem } from './ScrollStack';

const steps = [
	'Begin with your product details',
	'Plug in your ingredient list with automatic function & allergen tagging',
	'Etch in product usage with protips and warnings',
	'Connect extra tutorials and routines',
	'Plug in your support channels',
	'Preview and approve',
	'Get a QR — Voila, your experience is set!'
];

export default function HowToSection() {
	return (
		<section className="bg-[#f7f2fa] py-16 px-4">
			<div className="max-w-4xl mx-auto text-center mb-12">
				<h2 className="text-3xl md:text-5xl font-black bricolage-grotesque text-[#502274] mb-4">
					Creating experiences with Cxperia is ridiculously simple
				</h2>
				<p className="text-lg text-gray-700 mb-8">
					Just follow these steps and launch your interactive product experience in minutes.
				</p>
			</div>
			<ScrollStack className="max-w-2xl mx-auto" itemDistance={60} itemScale={0.04} itemStackDistance={40} stackPosition="25%" scaleEndPosition="10%" baseScale={0.9} rotationAmount={2} blurAmount={2} onStackComplete={() => {}}>
				{steps.map((step, idx) => (
					<ScrollStackItem key={idx} itemClassName="bg-white shadow-lg rounded-xl p-8 mb-4 flex items-center justify-center text-lg font-semibold text-[#502274] bricolage-grotesque">
						<span className="text-2xl font-bold mr-4 text-[#a855f7]">{idx + 1}</span>
						{step}
					</ScrollStackItem>
				))}
			</ScrollStack>
		</section>
	);
}
