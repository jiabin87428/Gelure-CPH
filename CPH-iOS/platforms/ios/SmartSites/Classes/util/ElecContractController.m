//
//  ElecContractController.m
//  chehaoyunV2.0
//
//  Created by 李家斌 on 15/11/20.
//  Copyright © 2015年 Frank ww. All rights reserved.
//  电子合同

#import "ElecContractController.h"
#import "ZPDFPageModel.h"

@interface ElecContractController ()<NSURLConnectionDataDelegate,UIDocumentInteractionControllerDelegate>{
    UIPageViewController *pageViewCtrl;
    ZPDFPageModel *pdfPageModel;
    NSURLRequest *request;
    
    NSMutableData *_receiveData;
    UIDocumentInteractionController *_documentInter;
}

@end

@implementation ElecContractController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.navigationItem.title = _vcTitle;
    self.view.backgroundColor = [UIColor whiteColor];
    //隐藏导航栏返回文字
    [[UIBarButtonItem appearance] setBackButtonTitlePositionAdjustment:UIOffsetMake(0, -60) forBarMetrics:UIBarMetricsDefault];
    self.navigationController.navigationBar.tintColor = [UIColor blackColor];
    
    UIBarButtonItem *backItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone target:self action:@selector(backClick:)];
    [backItem setTintColor:[UIColor whiteColor]];
    backItem.title = @"返回";
    self.navigationItem.leftBarButtonItem = backItem;
    
    UIButton *morebtn = [[UIButton alloc]initWithFrame:CGRectMake(0, 0, 32, 32)];
    [morebtn setBackgroundImage:[UIImage imageNamed:@"more.png"] forState:UIControlStateNormal];
    [morebtn addTarget:self action:@selector(moreClick:) forControlEvents:UIControlEventTouchUpInside];
    UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithCustomView:morebtn];
    self.navigationItem.rightBarButtonItem = item;
    
    UINavigationBar *bar = [UINavigationBar appearance];
    //设置显示的颜色
    bar.barTintColor = [UIColor colorWithRed:0/255.0 green:160/255.0 blue:223/255.0 alpha:1.0];
    
    //设置字体颜色
    bar.tintColor = [UIColor whiteColor];
    [bar setTitleTextAttributes:@{NSForegroundColorAttributeName : [UIColor whiteColor]}];
    
    [self getPDFData];
}

-(void)backClick:(id)sender{
    [self dismissViewControllerAnimated:YES completion:nil];
}

-(void)moreClick:(UIButton *)sender{
    __block ElecContractController *weakSelf = self;
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:nil message:nil preferredStyle:UIAlertControllerStyleActionSheet];
    UIAlertAction *cameraAction = [UIAlertAction actionWithTitle:@"使用其他应用打开" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action){
        _documentInter =
        [UIDocumentInteractionController
         interactionControllerWithURL:[NSURL fileURLWithPath:_pdfURL]];
        _documentInter.delegate = weakSelf;
        
        _documentInter.UTI = @"com.microsoft.word.doc";
        [_documentInter presentOpenInMenuFromRect:CGRectZero
                                           inView:weakSelf.view
                                         animated:YES];
    }];
    
    [alertController addAction:cameraAction];
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault handler:nil];
    
    [alertController addAction:cancelAction];
    //弹出视图
    [self presentViewController:alertController animated:YES completion:nil];
}

-(void)getPDFData{
    if ([_pdfURL isEqualToString:@""]) {
        UIAlertController * alertController = [UIAlertController alertControllerWithTitle: nil                                                                             message: _tip preferredStyle:UIAlertControllerStyleAlert];
        //添加Button
        UIAlertAction *confimAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action){
            [self.navigationController popViewControllerAnimated:YES];
        }];
        
        [alertController addAction:confimAction];
        [self presentViewController: alertController animated: YES completion: nil];
        return;
    }
    if ([_pdfURL hasPrefix:@"http"]) {
        //1. 创建请求路径
        NSURL *url = [NSURL URLWithString:_pdfURL];
        // 2. 将URL封装成请求
        request = [NSURLRequest requestWithURL:url];
        // 3. 通过NSURLConnection，并设置代理
        [NSURLConnection connectionWithRequest:request delegate:self];
    }else{
        NSFileManager* fm = [NSFileManager defaultManager];
        NSData* data = [[NSData alloc] init];
        data = [fm contentsAtPath:_pdfURL];
        CFDataRef myPDFData = (__bridge CFDataRef)data;
        CGDataProviderRef provider = CGDataProviderCreateWithCFData(myPDFData);
        CGPDFDocumentRef pdf = CGPDFDocumentCreateWithProvider(provider);
        [self loadPDF:pdf];
    }
}

/**
 * 接收到服务器响应时调用的方法
 */
- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSHTTPURLResponse *)response
{
    //获取所要下载文件的总长度
    self.contentLength = [response.allHeaderFields[@"Content-Length"] integerValue];
    _receiveData = [NSMutableData data];
    
    //拼接一个沙盒中的文件路径
//    NSString *filePath = [[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) lastObject] stringByAppendingPathComponent:@"Test.pdf"];
//    //创建指定路径的文件
//    [[NSFileManager defaultManager] createFileAtPath:filePath contents:nil attributes:nil];
//    //创建文件句柄
//    self.handle = [NSFileHandle fileHandleForWritingAtPath:filePath];
}
/**
 * 接收到服务器的数据时调用的方法
 */
- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    //定位到文件尾部，将服务器每次返回的文件数据都拼接到文件尾部
    [self.handle seekToEndOfFile];
    //通过文件句柄，将文件写入到沙盒中
    [self.handle writeData:data];
    //拼接已下载文件总长度
    self.currentLength += data.length;
    //计算下载进度
    CGFloat progress = 1.0 * self.currentLength / self.contentLength;
    
    [_receiveData appendData:data];
}
/**
 * 文件下载完毕时调用的方法
 */
- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    //关闭文件句柄，并清除
    [self.handle closeFile];
    self.handle = nil;
    //清空已下载文件长度
    self.currentLength = 0;
    
    CFDataRef myPDFData = (__bridge CFDataRef)_receiveData;
    CGDataProviderRef provider = CGDataProviderCreateWithCFData(myPDFData);
    CGPDFDocumentRef pdf = CGPDFDocumentCreateWithProvider(provider);
    [self loadPDF:pdf];
}

//生成PDF
-(void)loadPDF:(CGPDFDocumentRef)pdfDocument{
    pdfPageModel = [[ZPDFPageModel alloc] initWithPDFDocument:pdfDocument];
    
    NSDictionary *options = [NSDictionary dictionaryWithObject:
                             [NSNumber numberWithInteger: UIPageViewControllerSpineLocationMin]
                                                        forKey: UIPageViewControllerOptionSpineLocationKey];
    
    pageViewCtrl = [[UIPageViewController alloc] initWithTransitionStyle:UIPageViewControllerTransitionStylePageCurl
                                                   navigationOrientation:UIPageViewControllerNavigationOrientationVertical
                                                                 options:options];
    ZPDFPageController *initialViewController = [pdfPageModel viewControllerAtIndex:1];
    if (initialViewController == nil) {
        UIAlertController * alertController = [UIAlertController alertControllerWithTitle: nil                                                                             message: _tip preferredStyle:UIAlertControllerStyleAlert];
        //添加Button
        UIAlertAction *confimAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action){
            [self.navigationController popViewControllerAnimated:YES];
        }];
        
        [alertController addAction:confimAction];
        [self presentViewController: alertController animated: YES completion: nil];
        return;
    }
    NSArray *viewControllers = [NSArray arrayWithObject:initialViewController];
    [pageViewCtrl setDataSource:pdfPageModel];
    
    [pageViewCtrl setViewControllers:viewControllers
                           direction:UIPageViewControllerNavigationDirectionReverse
                            animated:NO
                          completion:^(BOOL f){}];
    [self addChildViewController:pageViewCtrl];
    [self.view addSubview:pageViewCtrl.view];
    [pageViewCtrl didMoveToParentViewController:self];
    
    [self addGestureRecognizerToView:pageViewCtrl.view];
}

// 添加所有的手势
- (void) addGestureRecognizerToView:(UIView *)view
{
    // 旋转手势
//    UIRotationGestureRecognizer *rotationGestureRecognizer = [[UIRotationGestureRecognizer alloc] initWithTarget:self action:@selector(rotateView:)];
//    [view addGestureRecognizer:rotationGestureRecognizer];
    
    // 缩放手势
    UIPinchGestureRecognizer *pinchGestureRecognizer = [[UIPinchGestureRecognizer alloc] initWithTarget:self action:@selector(pinchView:)];
    [view addGestureRecognizer:pinchGestureRecognizer];
    
    // 移动手势
    UIPanGestureRecognizer *panGestureRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(panView:)];
    [view addGestureRecognizer:panGestureRecognizer];
}

// 处理旋转手势
- (void) rotateView:(UIRotationGestureRecognizer *)rotationGestureRecognizer
{
    UIView *view = rotationGestureRecognizer.view;
    if (rotationGestureRecognizer.state == UIGestureRecognizerStateBegan || rotationGestureRecognizer.state == UIGestureRecognizerStateChanged) {
        view.transform = CGAffineTransformRotate(view.transform, rotationGestureRecognizer.rotation);
        [rotationGestureRecognizer setRotation:0];
    }
}

// 处理缩放手势
- (void) pinchView:(UIPinchGestureRecognizer *)pinchGestureRecognizer
{
    UIView *view = pinchGestureRecognizer.view;
    if (pinchGestureRecognizer.state == UIGestureRecognizerStateBegan || pinchGestureRecognizer.state == UIGestureRecognizerStateChanged) {
        view.transform = CGAffineTransformScale(view.transform, pinchGestureRecognizer.scale, pinchGestureRecognizer.scale);
        pinchGestureRecognizer.scale = 1;
    }
}

// 处理拖拉手势
- (void) panView:(UIPanGestureRecognizer *)panGestureRecognizer
{
    UIView *view = panGestureRecognizer.view;
    if (panGestureRecognizer.state == UIGestureRecognizerStateBegan || panGestureRecognizer.state == UIGestureRecognizerStateChanged) {
        CGPoint translation = [panGestureRecognizer translationInView:view.superview];
        [view setCenter:(CGPoint){view.center.x + translation.x, view.center.y + translation.y}];
        [panGestureRecognizer setTranslation:CGPointZero inView:view.superview];
    }
}

@end
