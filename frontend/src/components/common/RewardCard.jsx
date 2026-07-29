import { useNavigate } from 'react-router-dom';

export default function RewardCard({ reward, variant = 'carousel' }) {
  const navigate = useNavigate();
  const isGrid = variant === 'grid';
  const isOutOfStock = reward.status === 'habis';

  return (
    <div
      onClick={() => navigate(`/reward/${reward.id}`)}
      className={`cursor-pointer shrink-0 bg-white border border-primary/50 shadow-card rounded-card overflow-hidden
        ${isGrid ? 'w-full' : 'w-[280px]'}`}
    >
      <div className={`w-full relative bg-bg-field ${isGrid ? 'h-[124px]' : 'h-[140px]'}`}>
        {reward.image ? (
          <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate/10" />
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="bg-danger px-4 py-2 rounded-lg text-white text-xs shadow-elevated">Stok Habis</span>
          </div>
        )}
        {!isGrid && (
          <span className="absolute left-3 top-3 bg-primary/90 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-lg">
            {reward.category}
          </span>
        )}
      </div>
      <div className={`flex flex-col justify-between p-2.5 gap-1 ${isGrid ? '' : 'p-4 h-[119px]'}`}>
        {isGrid && (
          <span className="w-fit bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded-md">
            {reward.category}
          </span>
        )}
        <h3 className={`font-bold text-text-black leading-6 line-clamp-2 ${isGrid ? 'text-[15px]' : 'text-base'}`}>
          {reward.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold text-primary ${isGrid ? 'text-base' : 'text-lg'}`}>
            {reward.pointRequired.toLocaleString('id-ID')} Poin
          </span>
        </div>
      </div>
    </div>
  );
}