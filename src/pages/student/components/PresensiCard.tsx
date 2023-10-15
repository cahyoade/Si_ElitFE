type PresensiCardProps = {
    class_name: string
    class_type: string
    start_date: string
    end_date: string
    attend_at: string
    lastEditBy: string
}


function PresensiCard({class_name, class_type, start_date, end_date, attend_at, lastEditBy}: PresensiCardProps) {
    start_date = (new Date(start_date)).toLocaleString('id').substring(0, 16);
    end_date = (new Date(end_date)).toLocaleString('id').split(' ')[1].substring(0, 5);
    attend_at = (new Date(attend_at)).toLocaleString('id');

    return ( 
        <div className="bg-white p-8 rounded-xl border w-full">
            <p className="font-bold">{class_name}</p>
            <p className="font-light mb-2">{class_type} ({start_date} - {end_date})</p>
            <hr />
            <p className="font-light mt-2">Hadir pada {attend_at} [{lastEditBy}]</p>
        </div>
    );
}

export default PresensiCard;