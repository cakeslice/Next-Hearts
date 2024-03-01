export const ModalWrapper = ({ children }: { children: React.ReactNode }) => (
	<div className='min-h-96 w-full gap-5 px-8 py-6 flex flex-col justify-between items-center border-primary border-[4px] rounded-[14px] border-solid'>
		{children}
	</div>
)
