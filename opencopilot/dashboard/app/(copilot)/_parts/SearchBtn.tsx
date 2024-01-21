'use client';
import { useSearchModal } from '@/app/search-modal-atom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react'


export function SearchBtn() {
    const [, setOpen] = useSearchModal();
    return (
        <Button
            size='fit'
            variant='secondary'
            className='rounded-full p-2.5'
            onClick={() => setOpen(true)}
        >
            <Search className="h-4 w-4" />
        </Button>
    )
}
